import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';

export const DocumentLink = ({ document }) => {
  if (document.fields.URL) {
    return (
      <a href={document.fields.URL} target="_blank" rel="noreferrer">
        {document.fields.Name}{' '}
        <FontAwesomeIcon icon={faFileDownload} size="xs" />
      </a>
    );
  }

  return document.fields.Name;
};
