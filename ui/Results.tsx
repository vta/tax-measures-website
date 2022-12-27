import { BarChart } from '#/ui/BarChart';
import { CategoryInfo } from '#/ui/CategoryInfo';
import { Loading } from '#/ui/Loading';
import { ProjectsMap } from '#/ui/ProjectsMap';
import { ProjectsTable } from '#/ui/ProjectsTable';

export const Results = ({
  loading,
  results,
  data,
  setProjectModalProjects,
}) => {
  if (loading) {
    return <Loading loading={loading} />;
  }

  if (!results || !results.items || results.items.length === 0) {
    return null;
  }

  const shouldShowChartAndMap = () => {
    if (results.categoryCard && results.categoryCard.key === 'Administration') {
      return false;
    }

    return true;
  };

  return (
    <>
      <CategoryInfo categoryCard={results.categoryCard} data={data} />
      {shouldShowChartAndMap() && (
        <div className="card mb-3">
          <div className="card-body card-graph">
            <div className="row">
              <div className="col-md-6 col-print-12">
                <BarChart results={results} />
              </div>
              <div className="col-md-6 col-print-12">
                {data.geojsons && (
                  <ProjectsMap
                    data={data}
                    projectsToMap={results.projects}
                    setProjectModalProjects={setProjectModalProjects}
                    height="350px"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="card bg-blue text-white mb-3">
        <div className="card-body">
          <h3>Projects List</h3>
          <p>
            Below is a list of the projects correlated with the filter settings
            above
          </p>
          <ProjectsTable
            selectedProjects={results && results.projects}
            faqs={data.faqs}
            showButtons={true}
          />
        </div>
      </div>
      <style jsx>{`
        .card-graph {
          min-height: 400px;
        }
      `}</style>
    </>
  );
};
