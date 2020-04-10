import React from 'react'
import BarChart from './bar-chart'
import Loading from './loading'
import ProjectsMap from './projects-map'

const Results = ({ loading, results, data, setProjectModalProjects }) => {
  if (loading) {
    return <Loading loading={loading} />
  }

  if (!results || !results.items || !results.items.length) {
    return null
  }

  return (
    <div className='card mb-3'>
      <div className='card-body card-graph'>
        <div className='row'>
          <div className='col-md-6'>
            <BarChart results={results} />
          </div>
          <div className='col-md-6'>
            <ProjectsMap
              data={data}
              projectsToMap={results.projects}
              setProjectModalProjects={setProjectModalProjects}
              height="350px"
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .card-graph {
          min-height: 400px;
        }
      `}</style>
    </div>
  )
}

export default Results
