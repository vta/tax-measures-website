'use client';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { sortBy } from 'lodash';
import { getGranteeByProject } from '#/lib/util.js';
import { ProjectsTable } from '#/ui/ProjectsTable';

export const ProjectModal = ({
  selectedProjects,
  data: { grantees, faqs },
  onHide,
  show,
}) => {
  if (!selectedProjects || selectedProjects.length === 0) {
    return null;
  }

  const handleHide = () => {
    onHide();
  };

  const renderModalBody = () => {
    const sortedProjects = sortBy(selectedProjects, (project) => {
      // Show countywide projects last
      if (project.fields.hasProjectGeometry) {
        return 0;
      }

      const grantee = getGranteeByProject(project, grantees);

      if (
        grantee &&
        (grantee.fields.Name === 'VTA' ||
          grantee.fields.Name === 'Santa Clara County')
      ) {
        return 1;
      }

      return 0;
    });

    return (
      <ProjectsTable
        selectedProjects={sortedProjects}
        faqs={faqs}
        showButtons={false}
      />
    );
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleHide}
    >
      <Modal.Body>{renderModalBody()}</Modal.Body>
      <Modal.Footer className="d-print-none">
        <Button onClick={handleHide} className="btn-secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
