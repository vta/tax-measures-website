'use client';
import { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { groupBy, sortBy } from 'lodash';

import { DocumentLink } from '#/ui/DocumentLink';

export const DocumentsList = ({ documents }) => {
  const sortedDocuments = sortBy(documents, 'createdTime').reverse();

  const documentGroups = groupBy(
    sortedDocuments,
    (document) => document.fields['Document Type'],
  );
  const documentTypes = Object.keys(documentGroups)
    .filter((documentType) => documentType !== undefined)
    .sort();

  const [selectedDocumentType, setSelectedDocumentType] = useState(
    documentTypes?.[0],
  );

  if (documents.length === 0) {
    return 'None';
  }

  if (documentTypes.length < 2) {
    return (
      <ListGroup className="small-list-group">
        {sortedDocuments.map((document) => (
          <ListGroup.Item key={document.id}>
            <DocumentLink document={document} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }

  return (
    <div>
      <label>
        Document Type
        <select
          onChange={(event) => setSelectedDocumentType(event.target.value)}
          className="ms-2"
        >
          {documentTypes.map((documentType) => {
            return (
              <option value={documentType} key={documentType}>
                {documentType}
              </option>
            );
          })}
        </select>
      </label>
      <ListGroup className="small-list-group">
        {sortedDocuments
          .filter(
            (document) =>
              document.fields['Document Type'] === selectedDocumentType,
          )
          .map((document) => (
            <ListGroup.Item key={document.id}>
              <DocumentLink document={document} />
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
};
