'use client';

import { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortBy } from 'lodash';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import AnimateHeight from 'react-animate-height';

import { DocumentLink } from '#/ui/DocumentLink';

export const DocumentsList = ({ documents }) => {
  const [slideDownHeight, setSlideDownHeight] = useState(0);
  if (documents.length === 0) {
    return 'None';
  }

  const sortedDocuments = sortBy(documents, 'createdTime').reverse();

  return (
    <>
      <ListGroup className="small-list-group">
        {sortedDocuments.slice(0, 2).map((document) => (
          <ListGroup.Item key={document.id}>
            <DocumentLink document={document} />
          </ListGroup.Item>
        ))}
        {sortedDocuments.length > 2 && (
          <AnimateHeight
            id="document-list"
            duration={500}
            height={slideDownHeight}
          >
            {sortedDocuments.slice(2).map((document) => (
              <ListGroup.Item key={document.id}>
                <DocumentLink document={document} />
              </ListGroup.Item>
            ))}
          </AnimateHeight>
        )}
      </ListGroup>
      {sortedDocuments.length > 2 && (
        <button
          aria-expanded={slideDownHeight !== 0}
          aria-controls="document-list"
          onClick={() => setSlideDownHeight(slideDownHeight === 0 ? 'auto' : 0)}
          className="btn btn-primary btn-sm mt-2"
        >
          {slideDownHeight !== 0 ? (
            <>
              <FontAwesomeIcon icon={faChevronUp} className="mr-2" />
              Show Fewer
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
              Show More
            </>
          )}
        </button>
      )}
    </>
  );
};
