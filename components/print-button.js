/* global window */
import React from 'react'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons'

import { trackEvent } from '../lib/ga'
import { trans } from '../lib/translations'

const print = () => {
  trackEvent({
    action: 'click',
    category: 'print'
  })
  window.print()
}

const PrintButton = ({ className }) => {
  const router = useRouter()
  const { locale } = router

  return (
    <Button onClick={print} className={className} >
      <FontAwesomeIcon icon={faPrint} className="mr-2" /> {trans('print', locale)}
    </Button>
  )
}

export default PrintButton
