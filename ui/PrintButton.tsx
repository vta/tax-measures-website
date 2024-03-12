'use client';

/* global window */
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

import { event } from '#/lib/gtag.js';

const print = () => {
  event({
    action: 'click',
    category: 'print',
  });
  window.print();
};

export const PrintButton = ({ className }) => {
  return (
    <Button onClick={print} className={className}>
      <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
    </Button>
  );
};
