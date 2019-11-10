import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { sumBy } from 'lodash'
import { formatCurrencyMillions } from '../lib/util'
import AboutModal from '../components/about-modal'

const HeaderStats = props => {
  const [aboutModalShow, setAboutModalShow] = useState(false)
  const { allocations, revenue } = props

  const totalAllocations = sumBy(allocations, 'fields.Amount')
  const totalRevenue = sumBy(revenue, 'fields.Amount')

  return (
    <div className='row header-bar mb-3'>
      <div className='col-md'>
        <div className='header-stat'>
          <div className='header-stat-value'>{formatCurrencyMillions(totalRevenue)}</div>
          <div className='header-stat-unit'>million</div>
          <div className='header-stat-label'>collected since 2018</div>
        </div>
      </div>
      <div className='col-md'>
        <div className='header-stat'>
          <div className='header-stat-value'>$0k</div>
          <div className='header-stat-unit'></div>
          <div className='header-stat-label'>interest earned</div>
        </div>
      </div>
      <div className='col-md'>
        <div className='header-stat'>
          <div className='header-stat-value'>{formatCurrencyMillions(totalAllocations)}</div>
          <div className='header-stat-unit'>million</div>
          <div className='header-stat-label'>allocated since 2017</div>
        </div>
      </div>
      <div className='col-md-2'>
        <div
          className='question-button float-right'
          onClick={() => setAboutModalShow(true)}
          aria-label="About Measure B"
        >
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon={faCircle} color="#51BAEC" />
            <FontAwesomeIcon icon={faQuestion} color="white" transform="shrink-6" />
          </span>
        </div>
      </div>

      <AboutModal
        show={aboutModalShow}
        onHide={() => setAboutModalShow(false)}
      />
    </div>
  )
}

export default HeaderStats
