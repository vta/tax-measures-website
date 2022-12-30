'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

import Button from 'react-bootstrap/Button';
import { AboutModal } from '#/ui/AboutModal';

export const AboutButton = ({ data }) => {
  const [aboutModalShow, setAboutModalShow] = useState(false);

  return (
    <>
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

      <AboutModal
        faqs={data.faqs}
        show={aboutModalShow}
        onHide={() => setAboutModalShow(false)}
      />
    </>
  );
};
