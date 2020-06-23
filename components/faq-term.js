import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faCircle as faCircleSolid } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'


const FaqTerm = ({ id, term, faqs, placement }) => {
  const faq = faqs && faqs.find(f => f.nid === id)

  if (!faq) {
    return null
  }

  console.log(faq)

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">{term}</Popover.Title>
      <Popover.Content dangerouslySetInnerHTML={{ __html: faq['faq-answer'] }} />
    </Popover>
  );


  return (
    <>
      <OverlayTrigger trigger={['hover', 'focus']} placement={placement} overlay={popover}>
        <span className="fa-layers fa-fw faq-term">
          <FontAwesomeIcon icon={faCircleSolid} color="#c8d3d9" transform="shrink-1" />
          <FontAwesomeIcon icon={faCircle} color="#2D65B1" transform="shrink-1" />
          <FontAwesomeIcon icon={faQuestion} title={`Define ${term}`} color="#2D65B1" transform="shrink-8" />
        </span>
      </OverlayTrigger>
      <style jsx>{`
      `}</style>
    </>
  )
}

export default FaqTerm
