import Alert from 'react-bootstrap/Alert';
import { compact } from 'lodash';

export const FilterAlert = ({ results, currentFilters }) => {
  const filterCount = currentFilters
    ? compact(Object.values(currentFilters)).length
    : 0;
  if (!results) {
    return null;
  }

  if (results.items.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>No funded projects meet these criteria.</Alert.Heading>
        <div>Try adjusting search filters.</div>
      </Alert>
    );
  }

  if (results.items.length < 5) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>Limited results</Alert.Heading>
        <div>
          Consider broadening your search if you&apos;re not seeing enough
          results. Select a broader date range or choose additional categories,
          grantees or projects.
        </div>
      </Alert>
    );
  }

  if (filterCount < 2) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>Numerous results</Alert.Heading>
        <div>
          Consider selecting additional filters to narrow down your results or
          focus on the information you&apos;re interested in.
        </div>
      </Alert>
    );
  }

  return null;
};
