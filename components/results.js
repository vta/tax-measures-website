import React from 'react';
import BarChart from './bar-chart.js';
import CategoryInfo from './category-info.js';
import Loading from './loading.js';
import ProjectsMap from './projects-map.js';
import ProjectsTable from './projects-table.js';

const Results = ({
  loading,
  results,
  data,
  geojsons,
  setProjectModalProjects,
}) => {
  if (loading) {
    return <Loading loading={loading} />;
  }

  if (!results || !results.items || results.items.length === 0) {
    return null;
  }

  return (
    <>
      <CategoryInfo categoryCard={results.categoryCard} data={data} />
      <div className="card mb-3">
        <div className="card-body card-graph">
          <div className="row">
            <div className="col-md-6 col-print-12">
              <BarChart results={results} />
            </div>
            <div className="col-md-6 col-print-12">
              {geojsons && (
                <ProjectsMap
                  data={data}
                  geojsons={geojsons}
                  projectsToMap={results.projects}
                  setProjectModalProjects={setProjectModalProjects}
                  height="350px"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-blue text-white mb-3">
        <div className="card-body">
          <h3>Projects List</h3>
          <p>
            Below is a list of the projects correlated with the filter settings
            above
          </p>
          <ProjectsTable
            selectedProjects={results && results.projects}
            setProjectModalProjects={setProjectModalProjects}
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

export default Results;
