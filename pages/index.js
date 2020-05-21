import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Alert from 'react-bootstrap/Alert'
import { compact, isEmpty } from 'lodash'
import AboutModal from '../components/about-modal'
import FilterControls from '../components/filter-controls'
import Footer from '../components/footer'
import Header from '../components/header'
import HomepageChart from '../components/homepage-chart'
import Loading from '../components/loading'
import ProjectsMap from '../components/projects-map'
import ProjectsTable from '../components/projects-table'
import ProjectModal from '../components/project-modal'
import Results from '../components/results'
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
import { categoryCards } from '../lib/category-cards'

const Home = () => {
  const router = useRouter()
  const [results, setResults] = useState()
  const [loading, setLoading] = useState(true)
  const [incomingFilters, setIncomingFilters] = useState({})
  const [currentFilters, setCurrentFilters] = useState({})
  const [projectModalProjects, setProjectModalProjects] = useState()
  const [aboutModalShow, setAboutModalShow] = useState(false)
  const [data, setData] = useState()
  const [loadingError, setLoadingError] = useState()

  useEffect(() => {
    if (!projectModalProjects || projectModalProjects.length === 0 ) {
      updateUrlWithFilters(currentFilters)
    } else {
      updateUrlWithFilters(currentFilters, projectModalProjects.map(p => p.id))
    }
  }, [projectModalProjects])

  useEffect(() => {
    const initialFilters = getInitialFiltersFromUrlQuery(router.query)
    const modalProjectIds = router.query.project_ids ? router.query.project_ids.split(',') : undefined

    // Merge category cards and categories
    if (data && data.categories) {
      categoryCards.forEach(categoryCard => {
        const category = data.categories.find(c => c.fields.Name === categoryCard.key)
        categoryCard.description = category && category.fields.Description
      })
    }

    // Wait to set initialFilters until data is loaded
    if (data && !isEmpty(initialFilters)) {
      setIncomingFilters(initialFilters)
      handleSearch(initialFilters)

      if (modalProjectIds) {
        setProjectModalProjects(modalProjectIds.map(projectId => data.projects.find(p => p.id === projectId)))
      }
    }
  }, [data])

  const handleSearch = filters => {
    setLoading(true)
    setResults(applyFilters(filters, data.awards, data.payments, data.projects, data.categories, data.grantees))
    updateUrlWithFilters(filters)
    setCurrentFilters(filters)
    setLoading(false)
  }

  const clearSearch = () => {
    setResults()
    setIncomingFilters({})
    updateUrlWithFilters()
  }

  const loadInitialData = async () => {
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

      setData(await preprocessData({
        allocations,
        awards,
        categories,
        documents,
        grantees,
        payments,
        projects,
        revenue
      }))
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoadingError(error)
      setLoading(false)
    }
  }

  if (!data && !loadingError) {
    loadInitialData()
  }

  const currentSingleCategoryCard = currentFilters && currentFilters.category && currentFilters.category.length === 1 && categoryCards.find(c => c.key === currentFilters.category[0])

  return (
    <div>
      <Head>
        <title>2016 Measure B</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        data={data}
        setAboutModalShow={setAboutModalShow}
      />

      <div className="container-fluid">
        <div className="row pt-3">
          <div className="col">
            {<FilterControls
              handleSearch={handleSearch}
              clearSearch={clearSearch}
              data={data}
              incomingFilters={incomingFilters}
            />}

            <FilterAlert results={results} currentFilters={currentFilters} />

            {loadingError && <Alert variant="danger" className="text-center">
              <Alert.Heading>Unable to load project data</Alert.Heading>
              <div>Please try again later.</div>
            </Alert>}
          </div>
        </div>

        {!results && <div className="row mb-3">
          <div className="col-lg-6 offset-lg-3">
            <div className="card">
              <div className="card-body">
                <h3>See how 2016 Measure B has been spent</h3>
                <ul>
                  <li>Filter by program categories or grantees</li>
                  <li>Search for a specific project by name</li>
                  <li>Visualize funding in a chart or map</li>
                  <li>Download project data as a PDF or CSV</li>
                </ul>
                <div><a href="#" onClick={() => setAboutModalShow(true)}>Read More &raquo;</a></div>
              </div>
            </div>
          </div>
        </div>}

        <Loading loading={loading} />

        {!results && data && <div className="card mb-3">
          <div className="card-body card-graph">
            <div className="row">
              <div className="col-md-6">
                <HomepageChart data={data} />
              </div>
              <div className="col-md-6">
                <ProjectsMap
                  data={data}
                  projectsToMap={data.projects}
                  setProjectModalProjects={setProjectModalProjects}
                  height="490px"
                />
              </div>
            </div>
          </div>
        </div>}

        {currentSingleCategoryCard && <div className="row mb-3">
          <div className="col-lg-6 offset-lg-3">
            <div className="card h-100">
              <div className="card-body d-flex">
                <img src={`/images/programs/${currentSingleCategoryCard.image}`} alt={currentSingleCategoryCard.key} width="150" height="150" className="mr-3 flex-shrink-0" />
                <div>
                  <h3>{currentSingleCategoryCard.key}</h3>
                  <p>{currentSingleCategoryCard.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>}

        <div className="row">
          <div className="col">
            {data && <Results
              loading={loading}
              results={results}
              data={data}
              setProjectModalProjects={setProjectModalProjects}
            />}
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

        {!results && data && <div className="row">
          {categoryCards.map(({ key, image }) => (
            <div className="col-md-3 mb-3" key={key}>
              <a className="card" title={`Show all ${key} projects`} href="#" onClick={event => {
                event.preventDefault()

                const categoryFilters = {
                  transactionType: 'award',
                  category: [key]
                }

                setIncomingFilters(categoryFilters)
                handleSearch(categoryFilters)
                window.scrollTo(0, 0)
              }}>
                <div className="card-body">
                  <h3>{key}</h3>
                  <img src={`/images/programs/${image}`} alt={key} className="w-100" />
                </div>
              </a>
            </div>
          ))}
        </div>}

        <Footer />
      </div>

      <AboutModal
        show={aboutModalShow}
        onHide={() => setAboutModalShow(false)}
      />

      <ProjectModal
        show={Boolean(projectModalProjects)}
        selectedProjects={projectModalProjects}
        onHide={() => setProjectModalProjects()}
        data={data || {}}
        setProjectModalProjects={setProjectModalProjects}
      />
    </div>
  )
}

const FilterAlert = ({ results, currentFilters }) => {
  const filterCount = currentFilters ? compact(Object.values(currentFilters)).length : 0
  if (!results) {
    return null
  }

  if (results.items.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>No funded projects meet these criteria.</Alert.Heading>
        <div>Try adjusting search filters.</div>
      </Alert>
    )
  }

  if (results.items.length < 5) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>Limited results</Alert.Heading>
        <div>Consider broadening your search if you're not seeing enough results. Select a broader date range or choose additional categories, grantees or projects.</div>
      </Alert>
    )
  }

  if (filterCount < 2) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>Numerous results</Alert.Heading>
        <div>Consider selecting additional filters to narrow down your results or focus on the information you're interested in.</div>
      </Alert>
    )
  }

  return null
}

export default Home
