import React, { useState } from 'react'
import Head from 'next/head'
import Alert from 'react-bootstrap/Alert'
import { compact } from 'lodash'
import ArrowButton from '../components/arrow-button'
import FilterControls from '../components/filter-controls'
import Footer from '../components/footer'
import HeaderStats from '../components/header-stats'
import ProjectsList from '../components/projects-list'
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
  getInitialFiltersFromQuery,
  preprocessData,
  updateUrlWithFilters
} from '../lib/util'

const Home = ({
  allocations,
  awards,
  categories,
  documents,
  grantees,
  payments,
  projects,
  revenue,
  initialFilters
}) => {
  const [results, setResults] = useState()
  const [loading, setLoading] = useState(false)
  const [incomingFilters, setIncomingFilters] = useState(initialFilters)
  const [currentFilters, setCurrentFilters] = useState(initialFilters)
  const [projectModalProject, setProjectModalProject] = useState()

  const handleSearch = filters => {
    setLoading(true)
    setResults(applyFilters(filters, allocations, payments, projects, categories, grantees))
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
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='container-fluid'>
        <div className='row mb-3'>
          <div className='col-md-3 bg-light-blue text-white pt-3 pb-3'>
            <h1><img src="/images/logo.png" alt="2016 Measure B" className="logo" /></h1>
            <h3 className='mt-3'>Sample Queries</h3>
            <p><i>Click on one of the questions below to change the filters to the settings which answer that question.</i></p>
            <div>
              <ArrowButton 
                onClick={() => setIncomingFilters({
                  transactionType: 'allocation',
                  startDate: '2017-1-1',
                  endDate: '2017-12-31'
                })}
              >
                How many funds were allocated in 2017?
              </ArrowButton>
              <ArrowButton 
                onClick={() => setIncomingFilters({
                  transactionType: 'payment',
                  startDate: '2019-1-1',
                  endDate: '2019-12-31'
                })}
              >
                How many funds were spent in 2019?
              </ArrowButton>
              <ArrowButton 
                onClick={() => setIncomingFilters({
                  transactionType: 'payment',
                  category: 'Bike/Ped'
                })}
              >
                How many dollars have been spent on bikes?
              </ArrowButton>
              <ArrowButton 
                onClick={() => setIncomingFilters({
                  transactionType: 'allocation',
                  grantee: 'Palo Alto'
                })}
              >
                How much has been allocated to Palo Alto?
              </ArrowButton>
            </div>
          </div>

          <div className='col'>
            <HeaderStats
              allocations={allocations}
              revenue={revenue}
            />

            <FilterControls
              handleSearch={handleSearch}
              clearSearch={clearSearch}
              projects={projects}
              grantees={grantees}
              categories={categories}
              incomingFilters={incomingFilters}
            />

            <FilterAlert results={results} currentFilters={currentFilters} />

            {!results  && <div className='card mb-3'>
              <div className='card-body'>
                <h3>See how much Measure B has collected to suport transportation, and how that money has been spent.</h3>
                <div>This website provides a gateway to understanding Measure B spending. Use the filters above to pick the timeframe, categories, and grantees you're interested in examining the allocations, payments, and projects for. Below you'll see the data you requested visualized. On the "Money" mode, you'll see a cross section of the funding that fits your filter. If you switch to the "Map" tab, you'll see the relevant projects geographically. Below is a text list of those projects, as well as a tool to export that list of projects in a spreadsheet form. <a href="#" onClick={() => setAboutModalShow(true)}>Read more about Measure B &raquo;</a></div>
              </div>
            </div>}

            <Results
              loading={loading}
              results={results}
              setProjectModalProject={setProjectModalProject}
            />
          </div>
        </div>

        <ProjectsList
          results={results}
          setProjectModalProject={setProjectModalProject}
        />

        <Footer />
      </div>

      <ProjectModal
        show={!!projectModalProject}
        project={projectModalProject}
        onHide={() => setProjectModalProject()}
        allocations={allocations}
        awards={awards}
        documents={documents}
        grantees={grantees}
        payments={payments}
      />

      <style jsx>{`
        .logo {
          max-height: 120px;
        }
      `}</style>
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

  const initialFilters = getInitialFiltersFromQuery(query)

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
}

export default Home
