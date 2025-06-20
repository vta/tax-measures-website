'use server';

import Image from 'next/image';
import { sumBy } from 'lodash';
import moment from 'moment';

import { fetchData } from '#/lib/api.js';
import { formatCurrencyBillions } from '#/lib/formatters.js';
import { getCurrentFiscalYear, findLatestYear } from '#/lib/util.js';
import { FaqTerm } from '#/ui/FaqTerm';
import { Menu } from '#/ui/Menu';

export async function HomeHeader() {
  const data = await fetchData();

  const currentFiscalYear = getCurrentFiscalYear();
  const allocationsThroughTwoYearsIntoTheFuture = data.allocations.filter(
    (allocation) => {
      if (allocation.fields['Available Start']) {
        return (
          Number.parseInt(allocation.fields['Available Start'], 10) <=
          currentFiscalYear + 2
        );
      }

      return false;
    },
  );

  /* eslint-disable @next/next/no-html-link-for-pages */
  const LogoLink = () => (
    <a href="/">
      <h1
        className="py-2 py-md-3 m-0 h-100 d-flex align-items-center justify-content-center"
        style={{ width: '167px' }}
      >
        <span className="sr-only">2016 Measure B</span>
        <Image
          src="/images/logo.png"
          alt=""
          className="home-logo"
          width="738"
          height="598"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </h1>
    </a>
  );
  /* eslint-enable @next/next/no-html-link-for-pages */

  const latestAwardDate = moment
    .max(
      data.revenue
        .filter((r) => r.fields.Date !== undefined)
        .map((r) => moment(r.fields.Date, 'YYYY-MM-DD')),
    )
    .format('MMM D, YYYY');

  const latestExpenditureDate = moment
    .max(
      data.expenditures
        .filter((e) => e.fields.Date !== undefined)
        .map((e) => moment(e.fields.Date, 'YYYY-MM-DD')),
    )
    .format('MMM D, YYYY');

  return (
    <div className="container-fluid">
      <div className="row bg-white no-gutters d-block d-lg-flex">
        <div className="col col-md-auto bg-light-blue text-white">
          <LogoLink />
        </div>
        <div className="col-md d-print-none">
          <div className="header-stat">
            <div className="header-stat-value">
              {formatCurrencyBillions(sumBy(data.revenue, 'fields.Amount'))}
            </div>
            <div className="header-stat-label">
              Billion Collected
              <FaqTerm
                term="Revenue Collected"
                faqs={data.faqs}
                placement="auto"
              />
            </div>
            <div className="header-state-date">Through {latestAwardDate}</div>
          </div>
        </div>
        <div className="col-md d-print-none">
          <div className="header-stat">
            <div className="header-stat-value">
              {formatCurrencyBillions(
                sumBy(allocationsThroughTwoYearsIntoTheFuture, 'fields.Amount'),
              )}
            </div>
            <div className="header-stat-label">
              Billion Allocated
              <FaqTerm term="Allocations" faqs={data.faqs} placement="auto" />
            </div>
            <div className="header-state-date">
              Through{' '}
              {moment(
                findLatestYear(
                  allocationsThroughTwoYearsIntoTheFuture.map((r) =>
                    Number.parseInt(r.fields['Available Start'], 10),
                  ),
                ),
                'YYYY',
              )
                .date(30)
                .month('June')
                .format('MMM D, YYYY')}
            </div>
          </div>
        </div>
        <div className="col-md d-print-none">
          <div className="header-stat">
            <div className="header-stat-value">
              {formatCurrencyBillions(
                sumBy(data.expenditures, 'fields.Amount'),
              )}
            </div>
            <div className="header-stat-label">
              Billion Spent
              <FaqTerm term="Expenditures" faqs={data.faqs} placement="auto" />
            </div>
            <div className="header-state-date">
              Through {latestExpenditureDate}
            </div>
          </div>
        </div>
        <div className="col-md-1"></div>
        <Menu />
      </div>
    </div>
  );
}
