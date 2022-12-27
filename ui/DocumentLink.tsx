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

  if (document.fields.Attachment && document.fields.Attachment.length === 1) {
    return (
      <a
        href={document.fields.Attachment[0].url}
        target="_blank"
        rel="noreferrer"
      >
        {document.fields.Name}{' '}
        <FontAwesomeIcon icon={faFileDownload} size="xs" />
      </a>
    );
  }

  if (document.fields.Attachment) {
    return document.fields.Attachment.map((attachment, index) => (
      <a
        href={attachment.url}
        target="_blank"
        key={index}
        className="mr-4"
        rel="noreferrer"
      >
        {index === 0 ? document.fields.Name : attachment.filename}{' '}
        <FontAwesomeIcon icon={faFileDownload} size="xs" />
      </a>
    ));
  }

  return document.fields.Name;
};
