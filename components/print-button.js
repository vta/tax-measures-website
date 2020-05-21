/* global window */
import React from 'react'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons'

const PrintButton = ({ className }) => {
  return (
    <Button onClick={() => window.print()} className={className}>
      <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
    </Button>
  )
}

export default PrintButton
