import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { sumBy } from 'lodash'
import Button from 'react-bootstrap/Button'
import { formatCurrencyMillions } from '../lib/formatters'

const Header = ({ data, setAboutModalShow }) => {
  return (
    <div className="row bg-white">
      <div className="col col-md-auto">
        <h1 className="bg-light-blue text-white p-2 p-md-3 m-0"><img src="/images/logo.png" alt="2016 Measure B" className="logo" /></h1>
      </div>
      <div className="col-md">
        {data && <div className="header-stat">
          <div className="header-stat-value">
            {formatCurrencyMillions(sumBy(data.revenue, 'fields.Amount'))}
          </div>
          <div className="header-stat-unit">million</div>
          <div className="header-stat-label">collected since 2017</div>
        </div>}
      </div>
      <div className="col-md">
        {data && <div className="header-stat">
          <div className="header-stat-value">
            {formatCurrencyMillions(sumBy(data.revenue, 'fields.Interest'))}
          </div>
          <div className="header-stat-unit">million</div>
          <div className="header-stat-label">interest earned</div>
        </div>}
      </div>
      <div className="col-md">
        {data && <div className="header-stat">
          <div className="header-stat-value">
            {formatCurrencyMillions(sumBy(data.allocations, 'fields.Amount'))}
          </div>
          <div className="header-stat-unit">million</div>
          <div className="header-stat-label">allocated since 2017</div>
        </div>}
      </div>
      <div className="col-md-2 d-flex align-items-center justify-content-center">
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
