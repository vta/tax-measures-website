import React from 'react'
import ReactMarkdown from 'react-markdown'
import ListGroup from 'react-bootstrap/ListGroup'
import DocumentLink from './document-link'

const CategoryInfo = ({ categoryCard }) => {
  if (!categoryCard) {
    return null
  }

  const renderDocuments = () => {
    if (categoryCard.documents.length === 0) {
      return null
    }

    return (
      <ListGroup className="small-list-group">
        {categoryCard.documents.map(document => (
          <ListGroup.Item key={document.id}>
            <DocumentLink document={document} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    )
  }

  return (
    <div className="row mb-3">
      <div className="col-lg-6 offset-lg-3">
        <div className="card h-100">
          <div className="card-body d-flex">
            <img src={`/images/programs/${categoryCard.image}`} alt={categoryCard.key} width="150" height="150" className="mr-3 flex-shrink-0" />
            <div>
              <h3>{categoryCard.key}</h3>
              <ReactMarkdown source={categoryCard.description} linkTarget="_blank" />
              {renderDocuments()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryInfo
