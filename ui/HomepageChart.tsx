'use client';

import Chart from 'react-apexcharts';
import { groupBy } from 'lodash';
import { formatCurrencyWithUnit, formatPercent } from '#/lib/formatters.js';
import { sumCurrency } from '#/lib/util.js';
import { FaqTerm } from '#/ui/FaqTerm';

export const HomepageChart = ({
  data: { allocations, parentCategories, faqs },
}) => {
  const actualAllocatedGroups = groupBy(
    allocations,
    (allocation) => allocation.fields.ParentCategoryName
  );

  const actualAllocateds = parentCategories.map((category) => {
    const group = actualAllocatedGroups[category.fields.Name] || [];

    return group.reduce((memo, allocation) => {
      return memo + allocation.fields.Amount;
    }, 0);
  });

  // If no category.fields['Ballot Allocation'] treat it as the actual allocated
  const remainingAllocateds = parentCategories.map(
    (category, index) =>
      (category.fields['Ballot Allocation'] || actualAllocateds[index]) -
      actualAllocateds[index]
  );
  const total = sumCurrency(
    parentCategories.map(
      (category, index) =>
        category.fields['Ballot Allocation'] || actualAllocateds[index]
    )
  );

  return (
    <>
      <h2>
        Percentage of Allocation through FY2023 vs. Total Ballot Allocation
        <FaqTerm
          id="1293971"
          term="Total Ballot Allocation"
          faqs={faqs}
          placement="bottom"
        />
      </h2>
      <div>Total Ballot Allocation: {formatCurrencyWithUnit(total)}</div>
      <Chart
        options={{
          chart: {
            type: 'bar',
            height: 350,
            offsetY: -20,
            stacked: true,
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                position: 'top',
              },
            },
          },
          colors: ['#BAD739', '#BDBEBD'],
          dataLabels: {
            enabled: true,
            textAnchor: 'start',
            offsetX: 25,
            formatter: (value, data) => {
              const { series } = data.w.config;
              const percent = formatPercent(
                (series[0].data[data.dataPointIndex] /
                  (series[0].data[data.dataPointIndex] +
                    series[1].data[data.dataPointIndex])) *
                  100
              );
              return percent;
            },
            style: {
              fontSize: '14px',
              colors: ['#4C4D55'],
            },
            enabledOnSeries: [1],
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
            categories: parentCategories.map((d) => d.fields.Name),
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
              formatter: (value, data) => {
                const total =
                  data.series[0][data.dataPointIndex] +
                  data.series[1][data.dataPointIndex];
                const percent = formatPercent(
                  (data.series[data.seriesIndex][data.dataPointIndex] / total) *
                    100
                );
                return `${formatCurrencyWithUnit(
                  value
                )} (${percent} of ${formatCurrencyWithUnit(total)})`;
              },
            },
          },
        }}
        series={[
          {
            name: 'Actual Allocated through FY23',
            data: actualAllocateds,
          },
          {
            name: 'Remaining Ballot Allocation',
            data: remainingAllocateds,
          },
        ]}
        type="bar"
      />
      <style jsx>{`
        h2 {
          font-size: 1.5rem;
          margin: 0;
        }
      `}</style>
    </>
  );
};
