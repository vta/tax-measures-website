import Spinner from 'react-bootstrap/Spinner';

export const Loading = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className="card mb-3">
      <div className="card-body card-loading text-center">
        <Spinner
          animation="border"
          role="status"
          size="xl"
          variant="primary"
          className="mb-4"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
        <h1>Loading...</h1>
      </div>
      <style jsx>{`
        .card-loading {
          min-height: 400px;
          padding-top: 80px;
        }
      `}</style>
    </div>
  );
};
