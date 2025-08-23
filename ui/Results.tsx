import { BarChart } from '#/ui/BarChart';
import { CategoryInfo } from '#/ui/CategoryInfo';
import { Loading } from '#/ui/Loading';
import { AllocationVsExpenditureChart } from '#/ui/AllocationVsExpenditureChart';
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

  if (!results || !results.projects || results.projects.length === 0) {
    return null;
  }

  const isAdministrationCategoryPage = () =>
    results.categoryCard && results.categoryCard.key === 'Administration';

  const Chart = () => {
    const pieChartCategories = [
      'BART Phase II',
      'Caltrain Corridor Capacity',
      'Local Streets & Roads',
      'Highway Interchanges',
      'County Expressways',
      'SR 85 Corridor',
    ];
    if (
      results.categoryCard &&
      pieChartCategories.includes(results.categoryCard.key)
    ) {
      return (
        <AllocationVsExpenditureChart
          projects={results.projects}
          allocations={data.allocations}
          expenditures={data.expenditures}
        />
      );
    }

    return (
      <BarChart
        results={results}
        awards={data.awards}
        expenditures={data.expenditures}
      />
    );
  };

  return (
    <>
      <CategoryInfo
        categoryCard={results.categoryCard}
        data={data}
        results={results}
      />
      {!isAdministrationCategoryPage() && (
        <>
          <div className="card mb-3">
            <div className="card-body card-graph">
              <div className="row">
                <div className="col-lg-6 col-print-12">
                  <Chart />
                </div>
                <div className="col-lg-6 col-print-12">
                  {data.geojsons && (
                    <ProjectsMap
                      data={data}
                      projectsToMap={results.projects}
                      setProjectModalProjects={setProjectModalProjects}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-blue text-white mb-3">
            <div className="card-body">
              <h2>Projects List</h2>
              <p>
                Below is a list of the projects correlated with the filter
                settings above
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
      )}
    </>
  );
};
