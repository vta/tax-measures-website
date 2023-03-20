'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

import Button from 'react-bootstrap/Button';

export const AboutButton = ({}) => {
  return (
    <Button
      href="/about"
      variant="primary"
      size="lg"
      title="About Measure B"
      className="mb-2 mt-2"
    >
      <FontAwesomeIcon icon={faQuestion} className="mr-2" />
      <span>About</span>
    </Button>
  );
};
