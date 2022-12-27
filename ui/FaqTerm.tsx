import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestion,
  faCircle as faCircleSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export const FaqTerm = ({ id, term, faqs, placement, showTerm }) => {
  const faq = faqs && faqs.find((f) => f.nid === id);

  if (!faq) {
    return showTerm ? <span>{term}</span> : null;
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Content
        dangerouslySetInnerHTML={{ __html: faq['faq-answer'] }}
      />
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger={['click']}
      placement={placement}
      overlay={popover}
      rootClose={true}
    >
      {showTerm ? (
        <span
          role="button"
          className="text-decoration-underline"
          onClick={(event) => event.stopPropagation()}
        >
          {term}
        </span>
      ) : (
        <span
          className="fa-layers fa-fw faq-term"
          role="button"
          onClick={(event) => event.stopPropagation()}
        >
          <FontAwesomeIcon
            icon={faCircleSolid}
            color="#c8d3d9"
            transform="shrink-1"
          />
          <FontAwesomeIcon
            icon={faCircle}
            color="#2D65B1"
            transform="shrink-1"
          />
          <FontAwesomeIcon
            icon={faQuestion}
            title={`Define ${term}`}
            color="#2D65B1"
            transform="shrink-8"
          />
        </span>
      )}
    </OverlayTrigger>
  );
};
