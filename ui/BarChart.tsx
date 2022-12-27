'use client';

import { groupBy, sortBy } from 'lodash';
import Chart from 'react-apexcharts';
import { formatCurrencyWithUnit } from '#/lib/formatters.js';
import { getProjectById, sumCurrency } from '#/lib/util.js';

export const BarChart = ({ results }) => {
  const getGraphAmount = (item) => {
    if (results.transactionType === 'award') {
      return item.fields['Award Amount'];
    }

    if (results.transactionType === 'expenditure') {
      return item.fields.Amount;
    }
  };

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
    '#69d2e7',
  ];

  const formatChartData = () => {
    const categoryGroups = results.filters.category
      ? groupBy(results.items, (item) => item.fields.CategoryName)
      : groupBy(results.items, (item) => item.fields.ParentCategoryName);

    // If more than one category present, chart by category
    if (Object.entries(categoryGroups).length > 1) {
      return {
        chartType: 'Category',
        chartData: categoryGroups,
      };
    }

    const projectGroups = results.items.reduce((memo, item) => {
      if (item.fields.Project) {
        const project = getProjectById(
          item.fields.Project[0],
          results.projects
        );
        if (project) {
          if (!memo[project.fields.Name]) {
            memo[project.fields.Name] = [];
          }

          memo[project.fields.Name].push(item);
        }
      } else {
        if (!memo.Unallocated) {
          memo.Unallocated = [];
        }

        memo.Unallocated.push(item);
      }

      return memo;
    }, {});

    // If fewer than 15 projects, chart by project
    if (
      Object.entries(projectGroups).length > 1 &&
      Object.entries(projectGroups).length < 15
    ) {
      return {
        chartType: 'Project',
        chartData: projectGroups,
      };
    }

    const granteeGroups = results.items.reduce((memo, item) => {
      if (item.fields.Project) {
        const project = getProjectById(
          item.fields.Project[0],
          results.projects
        );
        if (project) {
          if (!memo[project.fields['Grantee Name']]) {
            memo[project.fields['Grantee Name']] = [];
          }

          memo[project.fields['Grantee Name']].push(item);
        }
      } else {
        if (!memo.Unallocated) {
          memo.Unallocated = [];
        }

        memo.Unallocated.push(item);
      }

      return memo;
    }, {});

    return {
      chartType: 'Grantee',
      chartData: granteeGroups,
    };
  };

  const { chartType, chartData } = formatChartData();

  const data = sortBy(
    Object.entries(chartData).map(([title, group], index) => {
      return {
        value: sumCurrency(group.map((g) => getGraphAmount(g))),
        title,
        color: colorPalate[index % colorPalate.length],
      };
    }),
    'value'
  );

  const dataType =
    results.transactionType === 'award' ? 'Awards' : 'Expenditures';
  const total = sumCurrency(results.items.map((g) => getGraphAmount(g)));

  if (data.length <= 1) {
    return (
      <div>
        <p>
          Total {dataType}: {formatCurrencyWithUnit(total)}
        </p>
        <div className="text-center font-weight-bold mt-5">
          Not enough data for chart
        </div>
      </div>
    );
  }

  if (data.length > 15) {
    return (
      <div>
        <p>
          Total {dataType}: {formatCurrencyWithUnit(total)}
        </p>
        <div className="text-center font-weight-bold mt-5">
          Too much data for chart
        </div>
      </div>
    );
  }

  return (
    <Chart
      options={{
        chart: {
          toolbar: {
            show: false,
          },
        },
        title: {
          text: `${dataType} by ${chartType}`,
          style: {
            fontSize: 18,
          },
          floating: true,
        },
        subtitle: {
          text: `Total ${dataType}: ${formatCurrencyWithUnit(total)}`,
          style: {
            fontSize: 14,
          },
          offsetY: 24,
        },
        plotOptions: {
          bar: {
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          },
        },
        colors: data.map((d) => d.color),
        dataLabels: {
          enabled: true,
          formatter: formatCurrencyWithUnit,
          textAnchor: 'start',
          offsetX: -6,
          style: {
            fontSize: '14px',
            colors: ['#4C4D55'],
          },
          dropShadow: {
            enabled: true,
            color: '#fff',
            top: 0,
            left: 0,
            blur: 3,
          },
        },
        grid: {
          yaxis: {
            lines: {
              show: false,
            },
          },
          padding: {
            left: 18,
            right: 0,
          },
        },
        xaxis: {
          categories: data.map((d) => d.title),
          labels: {
            formatter: formatCurrencyWithUnit,
          },
        },
        yaxis: {
          labels: {
            maxWidth: 180,
          },
        },
        tooltip: {
          y: {
            formatter: formatCurrencyWithUnit,
            title: {
              formatter: (seriesName) =>
                seriesName === 'award'
                  ? 'Awards'
                  : seriesName === 'expenditure'
                  ? 'Expenditures'
                  : seriesName,
            },
          },
        },
      }}
      series={[
        {
          name: results.transactionType,
          data: data.map((d) => d.value),
        },
      ]}
      type="bar"
      height={350}
    />
  );
};
