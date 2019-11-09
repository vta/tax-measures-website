import React, { useState } from 'react'
import Head from 'next/head'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faQuestion } from '@fortawesome/free-solid-svg-icons'
import AboutModal from '../components/about-modal'
import ArrowButton from '../components/arrow-button'
import FilterControls from '../components/filter-controls'
import Footer from '../components/footer'
import PieChart from '../components/pie-chart'
import ProjectsList from '../components/projects-list'
import '../css/index.scss'
import { fetchCategories, fetchGrantees, fetchProjects } from '../lib/api'
import { getInitialFiltersFromQuery, preprocessData } from '../lib/util'

const Home = props => {
  const { categories, grantees, projects, initialFilters } = props
  const [aboutModalShow, setAboutModalShow] = useState(false)
  const [results, setResults] = useState()
  const [loading, setLoading] = useState(false)

  const handleSearch = filters => {
    setLoading(true)
    setResults()
    
    setTimeout(() => {
      setResults({
        pieChart: [
          {
            key: 'unallocated',
            value: 9,
            title: 'Unallocated'
          },
          {
            key: 'bike',
            value: 6,
            title: 'Bike'
          },
          {
            key: 'bus',
            value: 3,
            title: 'Bus'
          },
          {
            key: 'road',
            value: 16,
            title: 'Road'
          }
        ],
        moneyChart: [
          {
            key: 'corporate-tax',
            value: 9,
            title: 'Corporate Tax'
          },
          {
            key: 'interest',
            value: 6,
            title: 'Interest'
          },
          {
            key: 'road',
            value: 3,
            title: 'Road'
          },
          {
            key: 'tax',
            value: 16,
            title: 'Tax'
          },
          {
            key: 'donations',
            value: 16,
            title: 'Donations'
          }
        ],
        projects: [
          projects[0],
          projects[3],
          projects[5]
        ]
      })
      setLoading(false)
    }, 500)
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
              <ArrowButton>How many funds were received in 2018?</ArrowButton>
              <ArrowButton>How many funds were spent in 2018?</ArrowButton>
              <ArrowButton href="/?transactionType=payment&category=Bike%2FPed">How many dollars have been spent on bikes?</ArrowButton>
              <ArrowButton>How many funds are currently unallocated?</ArrowButton>
              <ArrowButton>Projected vs. Actuals</ArrowButton>
            </div>
          </div>

          <div className='col'>
            <div className='row header-bar mb-3'>
              <div className='col-md'>
                <div className='header-stat'>
                  <div className='header-stat-value'>$117</div>
                  <div className='header-stat-unit'>million</div>
                  <div className='header-stat-label'>collected since 2018</div>
                </div>
              </div>
              <div className='col-md'>
                <div className='header-stat'>
                  <div className='header-stat-value'>$155k</div>
                  <div className='header-stat-unit'></div>
                  <div className='header-stat-label'>interest earned</div>
                </div>
              </div>
              <div className='col-md'>
                <div className='header-stat'>
                  <div className='header-stat-value'>$89</div>
                  <div className='header-stat-unit'>million</div>
                  <div className='header-stat-label'>allocated in 2017</div>
                </div>
              </div>
              <div className='col-md-2'>
                <div
                  className='question-button float-right'
                  onClick={() => setAboutModalShow(true)}
                  aria-label="About Measure B"
                >
                  <span className="fa-layers fa-fw">
                    <FontAwesomeIcon icon={faCircle} color="#51BAEC" />
                    <FontAwesomeIcon icon={faQuestion} color="white" transform="shrink-6" />
                  </span>
                </div>
              </div>
            </div>
            <div className='row mb-3'>
              <div className='col'>
                <FilterControls
                  handleSearch={handleSearch}
                  projects={projects}
                  grantees={grantees}
                  categories={categories}
                  initialFilters={initialFilters}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <div className='card mb-3'>
                  <div className='card-body'>
                    <h3>See how much Measure B has collected to suport transportation, and how that money has been spent.</h3>
                    <div>This website provides a gateway to understanding Measure B spending. Use the filters above to pick the timeframe, categories, and grantees you're interested in examining the allocations, payments, and projects for. Below you'll see the data you requested visualized. On the "Money" mode, you'll see a cross section of the funding that fits your filter. If you switch to the "Map" tab, you'll see the relevant projects geographically. Below is a text list of those projects, as well as a tool to export that list of projects in a spreadsheet form. <a href="#" onClick={() => setAboutModalShow(true)}>Read more about Measure B &raquo;</a></div>
                  </div>
                </div>
              </div>
            </div>
            <ChartSection loading={loading} results={results} />
          </div>
        </div>

        <ProjectsList results={results} />

        <Footer />
      </div>

      <AboutModal
        show={aboutModalShow}
        onHide={() => setAboutModalShow(false)}
      />

      <style jsx>{`
      `}</style>
    </div>
  )
}

const ChartSection = props => {
  if (props.loading) {
    return (
      <div className='row'>
        <div className='col'>
          <div className='card'>
            <div className='card-body card-loading text-center'>
              <Spinner animation="border" role="status" size="xl" variant="primary" className='mb-4'>
                <span className="sr-only">Loading...</span>
              </Spinner>
              <h1>Loading...</h1>
            </div>
          </div>
        </div>
        <style jsx>{`
          .card-loading {
            min-height: 400px;
            padding-top: 80px;
          }
        `}</style>
      </div>
    )
  }

  if (!props.results) {
    return null
  }

  return (
    <div className='row'>
      <div className='col'>
        <div className='card'>
          <div className='card-body card-graph'>
            <div className='row'>
              <div className='col-md-6'>
                <ButtonGroup aria-label="Chart Type" size="sm">
                  <Button variant="primary">Pie</Button>
                  <Button variant="secondary">Bar</Button>
                </ButtonGroup>

                <PieChart data={props.results.pieChart} />
              </div>
              <div className='col-md-6'>
                <ButtonGroup aria-label="Display Type" size="sm" className="float-right">
                  <Button variant="primary">Money</Button>
                  <Button variant="secondary">Map</Button>
                </ButtonGroup>

                <PieChart data={props.results.moneyChart} />
              </div>
            </div>
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

Home.getInitialProps = async ({ query }) => {
  const [
    categories,
    grantees,
    projects
  ] = await Promise.all([
    fetchCategories(),
    fetchGrantees(),
    fetchProjects()
  ]);

  const initialFilters = getInitialFiltersFromQuery(query)

  return preprocessData({ categories, grantees, projects, initialFilters })
}

export default Home
