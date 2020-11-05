import React from 'react'
import { useRouter } from 'next/router'
import BarChart from './bar-chart'
import CategoryInfo from './category-info'
import Loading from './loading'
import ProjectsMap from './projects-map'
import ProjectsTable from './projects-table'
import { trans } from '../lib/translations'

const Results = ({ loading, results, data, geojsons, setProjectModalProjects }) => {
  const router = useRouter()
  const { locale } = router

  if (loading) {
    return <Loading loading={loading} />
  }

  if (!results || !results.items || results.items.length === 0) {
    return null
  }

  return (
    <>
      <CategoryInfo categoryCard={results.categoryCard} />
      <div className="card mb-3">
        <div className="card-body card-graph">
          <div className="row">
            <div className="col-md-6 col-print-12">
              <BarChart results={results} />
            </div>
            <div className="col-md-6 col-print-12">
              <ProjectsMap
                data={data}
                geojsons={geojsons}
                projectsToMap={results.projects}
                setProjectModalProjects={setProjectModalProjects}
                height="350px"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-blue text-white mb-3">
        <div className="card-body">
          <h3>{trans('results-title', locale)}</h3>
          <p>{trans('results-text', locale)}</p>
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
  )
}

export default Results
