import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { sumBy } from 'lodash'
import moment from 'moment'
import Button from 'react-bootstrap/Button'
import FaqTerm from './faq-term.js'
import { formatCurrencyMillions } from '../lib/formatters.js'
import { getCurrentFiscalYear, findLatestDate, findLatestYear } from '../lib/util.js'

const Header = ({ data, setAboutModalShow }) => {
  const currentFiscalYear = getCurrentFiscalYear()
  const allocationsThroughTwoYearsIntoTheFuture = data.allocations.filter(allocation => {
    if (allocation.fields['Available Start']) {
      return Number.parseInt(allocation.fields['Available Start'], 10) <= currentFiscalYear + 2
    }

    return false
  })

  return (
    <div className="row bg-white no-gutters d-block d-md-flex">
      <div className="col col-md-auto">
        <a href="/"><h1 className="bg-light-blue text-white p-2 p-md-3 m-0"><img src="/images/logo.png" alt="2016 Measure B" className="logo" /></h1></a>
      </div>
      <div className="col-md d-print-none">
        <div className="header-stat">
          <div className="header-stat-value">
            {formatCurrencyMillions(sumBy(data.revenue, 'fields.Amount'))}
          </div>
          <div className="header-stat-label">
            Million Collected
            <FaqTerm id="1293871" term="Revenue Collected" faqs={data.faqs} placement="auto" />
          </div>
          <div className="header-state-date">
            Through {moment(findLatestDate(data.revenue.map(r => r.fields.Date))).format('MMM D, YYYY')}
          </div>
        </div>
      </div>
      <div className="col-md d-print-none">
        <div className="header-stat">
          <div className="header-stat-value">
            {formatCurrencyMillions(sumBy(allocationsThroughTwoYearsIntoTheFuture, 'fields.Amount'))}
          </div>
          <div className="header-stat-label">
            Million Allocated
            <FaqTerm id="1327856" term="Allocations" faqs={data.faqs} placement="auto" />
          </div>
          <div className="header-state-date">
            Through {moment(findLatestYear(allocationsThroughTwoYearsIntoTheFuture.map(r => Number.parseInt(r.fields['Available Start'], 10))), 'YYYY').date('30').month('Junes').format('MMM D, YYYY')}
          </div>
        </div>
      </div>
      <div className="col-md-2 d-flex align-items-center justify-content-center d-print-none">
        <Button
          onClick={() => setAboutModalShow(true)}
          variant="primary"
          size="lg"
          title="About Measure B"
          className="mb-2 mt-2"
        >
          <FontAwesomeIcon icon={faQuestion} className="mr-2" />
          <span>About</span>
        </Button>
      </div>
    </div>
  )
}

export default Header
