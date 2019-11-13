import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Spinner from 'react-bootstrap/Spinner'
import PieChart from './pie-chart'
import ProjectMap from './project-map'

const Results = props => {
  const { loading, results } = props
  const [section1Toggle, setSection1Toggle] = useState('pie')

  if (loading) {
    return (
      <div className='card'>
        <div className='card-body card-loading text-center'>
          <Spinner animation="border" role="status" size="xl" variant="primary" className='mb-4'>
            <span className="sr-only">Loading...</span>
          </Spinner>
          <h1>Loading...</h1>
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

  if (!results || !results.items || !results.items.length) {
    return null
  }

  return (
    <div className='card'>
      <div className='card-body card-graph'>
        <div className='row'>
          <div className='col-md-6'>
            <ButtonGroup aria-label="Chart Type" size="sm" className="position-absolute">
              <Button
                variant="primary"
                onClick={() => setSection1Toggle('pie')}
              >
                Pie
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSection1Toggle('bar')}
              >
                Bar
              </Button>
            </ButtonGroup>

            <PieChart results={results} />
          </div>
          <div className='col-md-6'>
            <ProjectMap results={results} />
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
