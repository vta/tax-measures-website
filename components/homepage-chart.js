import React from 'react'
import dynamic from 'next/dynamic'
import { groupBy, sortBy } from 'lodash'
import { formatCurrencyWithUnit, formatPercent } from '../lib/formatters'
import { sumCurrency } from '../lib/util'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const HomepageChart = ({ data: { allocations, parentCategories } }) => {
  const actualAllocatedGroups = groupBy(allocations, allocation => allocation.fields['Parent Category'].id)

  const actualAllocateds = parentCategories.map(category => {
    const group = actualAllocatedGroups[category.id];

    return group.reduce((memo, allocation) => {
      return memo + allocation.fields.Amount
    }, 0)
  })

  // If no category.fields['Ballot Allocation'] treat it as the actual allocated
  const remainingAllocateds = parentCategories.map((category, index) => (category.fields['Ballot Allocation'] || actualAllocateds[index]) - actualAllocateds[index])
  const total = sumCurrency(parentCategories.map((category, index) => category.fields['Ballot Allocation'] || actualAllocateds[index]))

  return (
    <Chart
      options={{
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: false
          },
        },
        title: {
          text: 'Percentage of Allocation through FY2021 vs. Total Ballot Allocation',
          style: {
            fontSize: 18
          },
          floating: true
        },
        subtitle: {
          text: `Total Ballot Allocation: ${formatCurrencyWithUnit(total)}`,
          style: {
            fontSize: 14,
          },
          offsetY: 24
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          }
        },
        colors: ['#BAD739', '#BDBEBD'],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          offsetX: 25,
          formatter: (value, data) => {
            const series = data.w.config.series
            const percent = formatPercent(series[0].data[data.dataPointIndex] / (series[0].data[data.dataPointIndex] + series[1].data[data.dataPointIndex]) * 100)
            return percent
          },
          style: {
            fontSize: '14px',
            colors: ['#4C4D55']
          },
          enabledOnSeries: [1]
        },
        grid: {
          yaxis: {
            lines: {
              show: false
            }
          },
          padding: {
            left: 18,
            right: 0
          }
        },
        xaxis: {
          categories: parentCategories.map(d => d.fields.Name),
          labels: {
            formatter: formatCurrencyWithUnit
          }
        },
        yaxis: {
          labels: {
            maxWidth: 180,
          },
        },
        tooltip: {
          y: {
            formatter: (value, data) => {
              const total = data.series[0][data.dataPointIndex] + data.series[1][data.dataPointIndex]
              const percent = formatPercent(data.series[data.seriesIndex][data.dataPointIndex] / total * 100)
              return `${formatCurrencyWithUnit(value)} (${percent} of ${formatCurrencyWithUnit(total)})`
            }
          }
        },
      }}
      series={[{
        name: 'Actual Allocated through FY21',
        data: actualAllocateds,
      }, {
        name: 'Remaining Ballot Allocation',
        data: remainingAllocateds,
      }]}
      type="bar"
    />
  )
}

export default HomepageChart 
