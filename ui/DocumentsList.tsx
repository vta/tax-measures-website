'use client';

import { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortBy } from 'lodash';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { SlideDown } from 'react-slidedown';

import { DocumentLink } from '#/ui/DocumentLink';

export const DocumentsList = ({ documents }) => {
  const [slidedownOpen, setSlidedownOpen] = useState(false);
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
          <SlideDown className={'my-dropdown-slidedown'}>
            {slidedownOpen
              ? sortedDocuments.slice(2).map((document) => (
                  <ListGroup.Item key={document.id}>
                    <DocumentLink document={document} />
                  </ListGroup.Item>
                ))
              : null}
          </SlideDown>
        )}
      </ListGroup>
      {sortedDocuments.length > 2 && (
        <button
          onClick={() => setSlidedownOpen(!slidedownOpen)}
          className="btn btn-primary btn-sm mt-2"
        >
          {slidedownOpen ? (
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
