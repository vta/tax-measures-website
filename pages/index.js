/* global window */

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isEmpty, keyBy } from 'lodash'
import { NextSeo } from 'next-seo'
import AboutModal from '../components/about-modal'
import FilterAlert from '../components/filter-alert'
import FilterControls from '../components/filter-controls'
import Footer from '../components/footer'
import Header from '../components/header'
import HomepageChart from '../components/homepage-chart'
import Loading from '../components/loading'
import ProjectsMap from '../components/projects-map'
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
  getDocumentById,
  getFiltersFromQuery,
  preprocessData,
  fetchGeoJson,
  updateUrlWithFilters
} from '../lib/util'
import { categoryCards } from '../lib/category-cards'

const Home = ({ data }) => {
  const router = useRouter()
  const [results, setResults] = useState()
  const [loading, setLoading] = useState(true)
  const [incomingFilters, setIncomingFilters] = useState({})
  const [currentFilters, setCurrentFilters] = useState()
  const [projectModalProjects, setProjectModalProjects] = useState()
  const [aboutModalShow, setAboutModalShow] = useState(false)
  const [geojsons, setGeojsons] = useState()

  useEffect(() => {
    if (!projectModalProjects || projectModalProjects.length === 0) {
      updateUrlWithFilters(currentFilters)
    } else {
      updateUrlWithFilters(currentFilters, projectModalProjects.map(p => p.id))
    }
  }, [projectModalProjects])

  useEffect(() => {
    const filters = getFiltersFromQuery(router.query)
    const modalProjectIds = router.query.project_ids ? router.query.project_ids.split(',') : undefined

    if (!isEmpty(filters)) {
      setIncomingFilters(filters)
      handleSearch(filters)
    }

    if (modalProjectIds) {
      setProjectModalProjects(modalProjectIds.map(projectId => data.projects.find(p => p.id === projectId)))
    }
  }, [router.query])

  useEffect(() => {
    const fetchMapData = async () => {
      const mapData = [
        ...await fetchGeoJson(data.projects),
        ...await fetchGeoJson(data.grantees)
      ]

      setGeojsons(keyBy(mapData, 'id'))
      setLoading(false)
    }

    fetchMapData()
  }, [])

  const handleSearch = async filters => {
    setLoading(true)
    setResults(await applyFilters(filters, data.awards, data.payments, data.projects, data.categories, data.grantees))
    updateUrlWithFilters(filters, (projectModalProjects || []).map(p => p.id))
    setCurrentFilters(filters)
    setLoading(false)
  }

  const clearSearch = () => {
    setResults()
    setIncomingFilters({})
    setCurrentFilters()
    updateUrlWithFilters()
  }

  // Merge category cards and categories
  categoryCards.forEach(categoryCard => {
    const category = data.categories.find(c => c.fields.Name === categoryCard.key)
    categoryCard.description = category && category.fields.Description
    categoryCard.documents = category && category.fields.Documents && category.fields.Documents.map(id => getDocumentById(id, data.documents))
  })

  return (
    <div>
      <NextSeo
        title="2016 Measure B"
        description="A 30-year, half-cent countywide sales tax to enhance transit, highways, expressways and active transportation (bicycles, pedestrians and complete streets). The measure passed by nearly 72%, the highest level of support for any Santa Clara County transportation tax."
        canonical="https://2016measureb-beta.vta.org/"
        openGraph={{
          url: 'https://2016measureb-beta.vta.org/',
          title: '2016 Measure B',
          description: '"A 30-year, half-cent countywide sales tax to enhance transit, highways, expressways and active transportation (bicycles, pedestrians and complete streets). The measure passed by nearly 72%, the highest level of support for any Santa Clara County transportation tax.',
          images: [
            {
              url: 'https://2016measureb-beta.vta.org/meta/measureb-logo-square.png',
              width: 1200,
              height: 1200,
              alt: '2016 Measure B'
            }
          ]
        }}
      />
      <Head>
        <title>2016 Measure B</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        data={data}
        setAboutModalShow={setAboutModalShow}
      />

      <div className="container-fluid main-container">
        <div className="row pt-3 d-print-none">
          <div className="col">
            {<FilterControls
              handleSearch={handleSearch}
              clearSearch={clearSearch}
              data={data}
              incomingFilters={incomingFilters}
            />}

            <FilterAlert results={results} currentFilters={currentFilters} />
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

        <Results
          loading={loading}
          results={results}
          data={data}
          geojsons={geojsons}
          setProjectModalProjects={setProjectModalProjects}
        />

        <div className="row justify-content-center d-print-none">
          {categoryCards.map(({ key, image }) => (
            <div className="col-lg-5col col-md-4 col-xs-6 mb-3" key={key}>
              <a className="card h-100" title={`Show all ${key} projects`} href="#" onClick={event => {
                event.preventDefault()

                const categoryFilters = {
                  transactionType: 'award',
                  category: [key]
                }

                setIncomingFilters(categoryFilters)
                handleSearch(categoryFilters)
                window.scrollTo(0, 0)
              }}>
                <div className="card-body d-flex flex-column justify-content-between">
                  <h3 className="text-center">{key}</h3>
                  <img src={`/images/programs/${image}`} alt={key} className="w-100" />
                </div>
              </a>
            </div>
          ))}
        </div>

        {!results && !loading && <div className="card mb-3">
          <div className="card-body card-graph">
            <div className="row">
              <div className="col-md-6">
                <HomepageChart data={data} />
              </div>
              <div className="col-md-6">
                <ProjectsMap
                  data={data}
                  geojsons={geojsons}
                  projectsToMap={data.projects}
                  setProjectModalProjects={setProjectModalProjects}
                  height="490px"
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
        show={Boolean(projectModalProjects)}
        selectedProjects={projectModalProjects}
        onHide={() => setProjectModalProjects()}
        data={data}
        geojsons={geojsons}
        setProjectModalProjects={setProjectModalProjects}
      />
    </div>
  )
}

export async function getStaticProps() {
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

  const data = await preprocessData({
    allocations,
    awards,
    categories,
    documents,
    grantees,
    payments,
    projects,
    revenue
  })

  return {
    props: {
      data
    },
    // Attempt to re-generate the page at most every 10 minutes
    unstable_revalidate: 600
  }
}

export default Home
