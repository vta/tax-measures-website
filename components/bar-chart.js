import React from 'react'
import dynamic from 'next/dynamic'
import { groupBy, sumBy, sortBy } from 'lodash'
import { formatCurrencyWithUnit, getProjectByProjectId } from '../lib/util'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const BarChart = ({ results }) => {
  const colorPalate = [
    '#33b2df',
    '#546E7A',
    '#d4526e',
    '#13d8aa',
    '#A5978B',
    '#2b908f',
    '#f9a3a4',
    '#90ee7e',
    '#f48024',
    '#69d2e7'
  ]

  let groups

  if (results.filters.category) {
    // Use category
    groups = groupBy(results.items, item => item.fields.Category.fields.Name)
  } else {
    // Use parent category
    groups = groupBy(results.items, item => item.fields['Parent Category'].fields.Name)
  }

  if (Object.entries(groups).length === 1) {
    // If all items are in one category, graph by project instead

    groups = results.items.reduce((memo, item) => {
      if (item.fields.Project) {
        const project = getProjectByProjectId(item.fields.Project[0].id, results.projects)
        if (project) {
          if (!memo[project.fields.Name]) {
            memo[project.fields.Name] = []
          }
          memo[project.fields.Name].push(item)
        }
      } else if (item.fields.Projects){
        for (const projectId of item.fields.Projects) {
          const project = getProjectByProjectId(projectId, results.projects)
          if (project) {
            if (!memo[project.fields.Name]) {
              memo[project.fields.Name] = []
            }
            memo[project.fields.Name].push(item) 
          }
        }
      } else {
        if (!memo['Unallocated']) {
          memo['Unallocated'] = []
        }
        memo['Unallocated'].push(item)
      }
      
      return memo
    }, {})
  }

  const data = sortBy(Object.entries(groups).map(([title, group], index) => {
    return {
      value: sumBy(group, i => i.fields.Amount),
      title,
      color: colorPalate[index % colorPalate.length]
    }
  }), 'value')

  const chartType = results.transactionType === 'allocation' ? 'Allocations' : 'Payments'
  const total = sumBy(results.items, i => i.fields.Amount)

  if (data.length <= 1) {
    return (
      <div>
        <p>Total {chartType}: {formatCurrencyWithUnit(total)}</p>
        <div className="text-center font-weight-bold mt-5">Not enough data for chart</div>
      </div>
    )
  }

  return (
    <Chart
      options={{
        chart: {
          toolbar: {
            show: false
          },
          parentHeightOffset: 0
        },
        title: {
          text: `Total ${chartType}: ${formatCurrencyWithUnit(total)}`,
          style: {
            fontSize: 16
          }
        },
        plotOptions: {
          bar: {
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'top',
          },
          }
        },
        colors: data.map(d => d.color),
        dataLabels: {
          enabled: true,
          formatter: formatCurrencyWithUnit,
          textAnchor: 'start',
          offsetX: 40,
          style: {
            fontSize: '14px',
            colors: ['#4C4D55']
          }
        },
        grid: {
          yaxis: {
            lines: {
              show: false
            }
          },
          padding: {
            left: 0,
            right: 0
          }
        },
        xaxis: {
          categories: data.map(d => d.title),
          labels: {
            formatter: formatCurrencyWithUnit
          }
        },
        yaxis: {
          labels: {
            maxWidth: 200,
          }
        },
        tooltip: {
          y: {
            formatter: formatCurrencyWithUnit,
            title: {
              formatter: seriesName => seriesName === 'allocation' ? 'Allocations' : seriesName === 'payment' ? 'Payments' : seriesName
            }
          }
        }
      }}
      series={[{
        name: results.transactionType,
        data: data.map(d => d.value)
      }]}
      type="bar"
      height="350"
    />
  )
}

export default BarChart 
