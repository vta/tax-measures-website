import Alert from 'react-bootstrap/Alert';
import { compact } from 'lodash';

export const FilterAlert = ({ results, currentFilters }) => {
  const filterCount = currentFilters
    ? compact(Object.values(currentFilters)).length
    : 0;

  if (!results) {
    return null;
  }

  if (results.projects.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>No funded projects meet these criteria.</Alert.Heading>
        <div>Try adjusting search filters.</div>
      </Alert>
    );
  }

  return null;
};
