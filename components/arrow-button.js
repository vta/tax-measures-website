import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const ArrowButton = props => (
  <a className='card bg-blue text-white mb-2' href={props.href}>
    <div className='card-body'>
      <div className='arrow-text'>{props.children}</div>
      <span className="arrow-circle fa-layers fa-fw">
        <FontAwesomeIcon icon={faCircle} color="#51BAEC" />
        <FontAwesomeIcon icon={faChevronRight} color="white" transform="shrink-6 right-1" />
      </span>
    </div>

    <style jsx>{`
      .card-body {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    
      .arrow-text {
        font-size: 20px;
        line-height: 1.2;
      }
    
      .arrow-circle {
        margin-left: 15px;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: 30px;
        font-size: 30px;
      }
    `}</style>
  </a>
)

export default ArrowButton
