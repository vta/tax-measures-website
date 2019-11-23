import React from 'react'
import dynamic from 'next/dynamic'
import { groupBy, sumBy, sortBy } from 'lodash'
import { formatCurrencyWithUnit } from '../lib/util'

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

  const data = sortBy(Object.entries(groups).map(([categoryName, group], index) => {
    return {
      value: sumBy(group, i => i.fields.Amount),
      title: categoryName,
      color: colorPalate[index]
    }
  }), 'value')

  const chartType = results.transactionType === 'allocation' ? 'Allocations' : 'Payments'
  const total = sumBy(results.items, i => i.fields.Amount)

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
