import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { groupBy, sumBy, sortBy } from 'lodash'
import { formatCurrencyWithUnit } from '../lib/util'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const BarChart = props => {
  const { results } = props

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

  return (
    <Chart
      options={{
        chart: {
          toolbar: {
            show: false
          },
          parentHeightOffset: 0
        },
        plotOptions: {
          bar: {
            distributed: true,
            horizontal: true,
          }
        },
        colors: data.map(d => d.color),
        dataLabels: {
          enabled: true,
          formatter: formatCurrencyWithUnit,
          textAnchor: 'start',
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        grid: {
          yaxis: {
            lines: {
              show: false
            }
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
