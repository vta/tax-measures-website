'use client';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
export const WelcomeModal = ({ onHide, show }) => {
  const handleHide = () => {
    onHide();
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleHide}
    >
      <Modal.Header>
        <h2>What is this website?</h2>
      </Modal.Header>
      <Modal.Body>
        This website is a snapshot into 2016 Measure B revenues and spending.
        You can search, view and share unaudited financial information about
        programs and projects, updated quarterly or as new information is
        released.
      </Modal.Body>
      <Modal.Footer className="d-print-none">
        <Button onClick={handleHide} className="btn-secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
