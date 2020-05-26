import React from 'react'

const CategoryInfo = ({ categoryCard }) => {
  if (!categoryCard) {
    return null
  }

  return (
    <div className="row mb-3">
      <div className="col-lg-6 offset-lg-3">
        <div className="card h-100">
          <div className="card-body d-flex">
            <img src={`/images/programs/${categoryCard.image}`} alt={categoryCard.key} width="150" height="150" className="mr-3 flex-shrink-0" />
            <div>
              <h3>{categoryCard.key}</h3>
              <p>{categoryCard.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryInfo
