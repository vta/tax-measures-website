'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { groupBy, sortBy, capitalize } from 'lodash';

import { formatCurrencyWithUnit } from '#/lib/formatters.js';
import { getAwardById, getExpenditureById, sumCurrency } from '#/lib/util.js';
import Select from 'react-select';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const BarChart = ({ results, awards, expenditures }) => {
  const [transactionType, setTransactionType] = useState('award');

  const getGraphAmount = (item) => {
    if (transactionType === 'award') {
      return item.fields['Award Amount'];
    }

    if (transactionType === 'expenditure') {
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
    const categories = results.filters.category
      ? groupBy(results.projects, (project) => project.fields.CategoryName)
      : groupBy(
          results.projects,
          (project) => project.fields.ParentCategoryName,
        );

    // If more than one category present, chart by category
    if (Object.entries(categories).length > 1) {
      const categoryGroups = Object.entries(categories).reduce(
        (memo, [categoryName, projects]: [string, any[]]) => {
          if (!memo[categoryName]) {
            memo[categoryName] = [];
          }

          for (const project of projects) {
            const projectAwards = (project.fields?.Awards || []).reduce(
              (memo: any[], awardId) => {
                const award = getAwardById(awardId, awards);
                if (award) {
                  memo.push(award);
                }

                return memo;
              },
              [],
            );

            const projectExpenditures = (
              project.fields?.Expenditures || []
            ).reduce((memo: any[], expenditureId) => {
              const expenditure = getExpenditureById(
                expenditureId,
                expenditures,
              );
              if (expenditure) {
                memo.push(expenditure);
              }

              return memo;
            }, []);

            memo[categoryName].push(
              ...(transactionType === 'award'
                ? projectAwards
                : projectExpenditures),
            );
          }

          return memo;
        },
        {},
      );

      return {
        chartType: 'Category',
        chartData: categoryGroups,
      };
    }

    // If fewer than 15 projects, chart by project
    if (results.projects.length > 1 && results.projects.length < 15) {
      const projectGroups = results.projects.reduce((memo, project) => {
        if (!memo[project.fields.Name]) {
          memo[project.fields.Name] = [];
        }

        const projectAwards = (project.fields?.Awards || []).reduce(
          (memo: any[], awardId) => {
            const award = getAwardById(awardId, awards);
            if (award) {
              memo.push(award);
            }

            return memo;
          },
          [],
        );

        const projectExpenditures = (project.fields?.Expenditures || []).reduce(
          (memo: any[], expenditureId) => {
            const expenditure = getExpenditureById(expenditureId, expenditures);
            if (expenditure) {
              memo.push(expenditure);
            }

            return memo;
          },
          [],
        );

        memo[project.fields.Name].push(
          ...(transactionType === 'award'
            ? projectAwards
            : projectExpenditures),
        );

        return memo;
      }, {});

      return {
        chartType: 'Project',
        chartData: projectGroups,
      };
    }

    const granteeGroups = results.projects.reduce((memo, project) => {
      if (!memo[project.fields['Grantee Name']]) {
        memo[project.fields['Grantee Name']] = [];
      }

      const projectAwards = (project.fields?.Awards || []).reduce(
        (memo: any[], awardId) => {
          const award = getAwardById(awardId, awards);
          if (award) {
            memo.push(award);
          }

          return memo;
        },
        [],
      );

      const projectExpenditures = (project.fields?.Expenditures || []).reduce(
        (memo: any[], expenditureId) => {
          const expenditure = getExpenditureById(expenditureId, expenditures);
          if (expenditure) {
            memo.push(expenditure);
          }

          return memo;
        },
        [],
      );

      memo[project.fields['Grantee Name']].push(
        ...(transactionType === 'award' ? projectAwards : projectExpenditures),
      );

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
    'value',
  );

  const dataType = transactionType === 'award' ? 'Awards' : 'Expenditures';
  const total = sumCurrency(
    Object.values(chartData).flatMap((group) =>
      group.map((g) => getGraphAmount(g)),
    ),
  );

  if (data.length <= 1) {
    return (
      <div>
        <p>
          Total {dataType}: {formatCurrencyWithUnit(total)}
        </p>
        <div className="text-center fw-bold mt-5">
          Not enough data for chart
        </div>
      </div>
    );
  }

  if (data.length > 20) {
    return (
      <div>
        <p>
          Total {dataType}: {formatCurrencyWithUnit(total)}
        </p>
        <div className="text-center fw-bold mt-5">Too much data for chart</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 d-flex align-items-center justify-content-start gap-2">
        <label htmlFor="transaction-type">Transaction Type</label>
        <Select
          inputId="transaction-type"
          value={
            transactionType && [
              {
                value: transactionType,
                label: capitalize(transactionType),
              },
            ]
          }
          onChange={(selectedOption) =>
            setTransactionType(selectedOption.value)
          }
          options={[
            {
              label: 'Expenditure',
              value: 'expenditure',
            },
            {
              label: 'Award',
              value: 'award',
            },
          ]}
          placeholder="Select Transaction Type"
          className="w-50"
        />
      </div>
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
            name: transactionType,
            data: data.map((d) => d.value),
          },
        ]}
        type="bar"
        height={400}
        width="100%"
      />
    </div>
  );
};
