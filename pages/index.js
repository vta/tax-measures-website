import React, { useState } from 'react'
import Head from 'next/head'
import Alert from 'react-bootstrap/Alert'
import { compact } from 'lodash'
import AboutModal from '../components/about-modal'
import FilterControls from '../components/filter-controls'
import Footer from '../components/footer'
import HeaderStats from '../components/header-stats'
import HomepageChart from '../components/homepage-chart'
import ProjectsMap from '../components/projects-map'
import ProjectsTable from '../components/projects-table'
import ProjectModal from '../components/project-modal'
import Results from '../components/results'
import '../css/index.scss'
import {
  fetchAllocations,
  fetchAwards,
  fetchCategories,
  fetchDocuments,
  fetchGrantees,
  fetchPayments,
  fetchProjects,
  fetchRevenue
} from '../lib/api'
import {
  applyFilters,
  getInitialFiltersFromUrlQuery,
  preprocessData,
  updateUrlWithFilters
} from '../lib/util'

const Home = ({
  allocations,
  awards,
  categories,
  parentCategories,
  documents,
  grantees,
  payments,
  projects,
  revenue,
  initialFilters,
  loadingError,
}) => {
  const [results, setResults] = useState()
  const [loading, setLoading] = useState(false)
  const [incomingFilters, setIncomingFilters] = useState(initialFilters || {})
  const [currentFilters, setCurrentFilters] = useState(initialFilters || {})
  const [projectModalProjects, setProjectModalProjects] = useState()
  const [aboutModalShow, setAboutModalShow] = useState(false)

  const handleSearch = filters => {
    setLoading(true)
    setResults(applyFilters(filters, awards, payments, projects, categories, grantees))
    setCurrentFilters(filters)
    
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const clearSearch = () => {
    setResults()
    setIncomingFilters({})
    updateUrlWithFilters()
  }

  return (
    <div>
      <Head>
        <title>2016 Measure B</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeaderStats
        allocations={allocations}
        revenue={revenue}
        setAboutModalShow={setAboutModalShow}
      />

      <div className="container-fluid">
        <div className="row pt-3">
          <div className="col">
            <FilterControls
              handleSearch={handleSearch}
              clearSearch={clearSearch}
              projects={projects}
              grantees={grantees}
              categories={categories}
              incomingFilters={incomingFilters}
            />

            <FilterAlert results={results} currentFilters={currentFilters} />

            {loadingError && <Alert variant="danger" className="text-center">
              <Alert.Heading>Unable to load project data</Alert.Heading>
              <div>Please try again later.</div>
            </Alert>}
          </div>
        </div>

        {!results && <div className="row mb-3">
          <div className="col-md-6 offset-md-3">
            <div className="card">
              <div className="card-body">
                <h3>See how much 2016 Measure B has been collected to support transportation and how that money has been spent.</h3>
                <div>This website is a window to see where 2016 Measure B funds are going.  You can:</div>
                <ul>
                  <li>Use the filters above to pick the categories or grantees to find out how much money has been awarded and see how much of that award has been spent.</li>
                  <li>Search for specific project funding.</li>
                  <li>Visualize the funding in a chart or the projects geographically on a map.</li>
                  <li>Download project list data as a CSV.</li>
                </ul>
                <div><a href="#" onClick={() => setAboutModalShow(true)}>Read more about 2016 Measure B &raquo;</a></div>
              </div>
            </div>
          </div>
        </div>}

        {!results && projects && <div className='card mb-3'>
          <div className='card-body card-graph'>
            <div className='row'>
              <div className='col-md-6'>
                <HomepageChart
                  parentCategories={parentCategories}
                  allocations={allocations}
                />
              </div>
              <div className='col-md-6'>
                <ProjectsMap
                  projects={projects}
                  setProjectModalProjects={setProjectModalProjects}
                />
              </div>
            </div>
          </div>
        </div>}

        <div className="row">
          <div className="col">
            <Results
              loading={loading}
              results={results}
              grantees={grantees}
              setProjectModalProjects={setProjectModalProjects}
            />
          </div>
        </div>

        {results && <div className="row mb-3">
          <div className="col">
            <div className="card bg-blue text-white mb-3">
              <div className="card-body">
                <h3>Projects List</h3>
                <p>Below is a list of the projects correlated with the filter settings above</p>
                <ProjectsTable
                  selectedProjects={results && results.projects}
                  setProjectModalProjects={setProjectModalProjects}
                  showCSVDownloadLink={true}
                  showTotalRow={true}
                />
              </div>
            </div>
          </div>
        </div>}

        <Footer />
      </div>

      <AboutModal
        show={aboutModalShow}
        onHide={() => setAboutModalShow(false)}
      />

      <ProjectModal
        show={!!projectModalProjects}
        selectedProjects={projectModalProjects}
        onHide={() => setProjectModalProjects()}
        allocations={allocations}
        awards={awards}
        documents={documents}
        grantees={grantees}
        payments={payments}
        setProjectModalProjects={setProjectModalProjects}
      />
    </div>
  )
}

const FilterAlert = ({ results, currentFilters }) => {
  const filterCount = currentFilters ? compact(Object.values(currentFilters)).length : 0
  if (!results) {
    return null
  } else if (results.items.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>No matching results</Alert.Heading>
        <div>Please adjust the search filters and try again</div>
      </Alert>
    )
  } else if (results.items.length < 5) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>Limited results</Alert.Heading>
        <div>Consider broadening your search if you're not seeing enough results. Select a broader date range or choose additional categories, grantees or projects.</div>
      </Alert>
    )
  } else if (filterCount < 2) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>Numerous results</Alert.Heading>
        <div>Consider selecting additional filters to narrow down your results or focus on the information you're interested in.</div>
      </Alert>
    )
  }

  return null
}

Home.getInitialProps = async ({ query }) => {
  try {
    const [
      allocations,
      awards,
      categories,
      documents,
      grantees,
      payments,
      projects,
      revenue
    ] = await Promise.all([
      fetchAllocations(),
      fetchAwards(),
      fetchCategories(),
      fetchDocuments(),
      fetchGrantees(),
      fetchPayments(),
      fetchProjects(),
      fetchRevenue()
    ])

    const initialFilters = getInitialFiltersFromUrlQuery(query)

    return preprocessData({
      allocations,
      awards,
      categories,
      documents,
      grantees,
      payments,
      projects,
      revenue,
      initialFilters
    })
  } catch(error) {
    console.error(error);
    return {
      loadingError: error
    }
  }
}

export default Home
