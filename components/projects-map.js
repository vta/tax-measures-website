import React, { useState } from 'react'
import ReactMapGL, { NavigationControl, Popup } from 'react-map-gl'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
import MapLayer from '../components/map-layer'
import { formatCurrencyWithUnit, getViewport } from '../lib/util'

const PopupInfo = ({ popupInfo, onClose, setProjectModalProject }) => {
  const renderInfo = () => {
    if (popupInfo.projects.length === 1) {
      const project = popupInfo.projects[0]
      return (
        <>
          <div className="popup-title">
            <a
              href=""
              onClick={e => {
                e.preventDefault()
                setProjectModalProject(project)
              }}
            >
              {project.fields.Name}
            </a>
          </div>
          <div className="popup-stat">
            Category: {project.fields.Category.fields.Name}
          </div>
          <div className="popup-stat">
            Grantee: {project.fields['Grantee Name']}
          </div>
          <div className="popup-stat">
            Total Amount Awarded: {formatCurrencyWithUnit(project.fields.totalAwardAmount)}
          </div>
          <div className="popup-stat">
            Total Payments: {formatCurrencyWithUnit(project.fields.totalPaymentAmount)}
          </div>
          <style jsx>{`
            .popup-title {
              margin-right: 14px;
              color: #2D65B1;
            }
          `}</style>
        </>
      )
    } else {
      return popupInfo.projects.map(project => (
        <div className="popup-title" key={project.id}>
          <a
            href=""
            onClick={e => {
              e.preventDefault()
              setProjectModalProject(project)
            }}
          >
            {project.fields.Name}
          </a>
          <style jsx>{`
            .popup-title {
              margin-right: 14px;
              color: #2D65B1;
            }
          `}</style>
        </div>
      ))
    }
  }

  return (
    <Popup
      offsetTop={-20}
      latitude={popupInfo.latitude}
      longitude={popupInfo.longitude}
      closeButton={true}
      closeOnClick={false}
      onClose={onClose}
      anchor="bottom"
    >
      {renderInfo()}
    </Popup>
  )
}

const ProjectsMap = ({ results, grantees, setProjectModalProject }) => {
  const [popupInfo, setPopupInfo] = useState(null)

  const onMapClick = event => {
    const {
      features,
      lngLat
    } = event

    const projectIds = features.map(f => f.properties.projectId)
    const projects = results.projects.filter(project => projectIds.includes(project.id))

    if (!projects.length) {
      return
    }

    setPopupInfo({
      projects,
      latitude: lngLat[1],
      longitude: lngLat[0]
    })
  }

  const { layers, layerIds, bbox } = MapLayer(results.projects, grantees)
  const [viewport, setViewport] = useState(getViewport(bbox))

  return (
    <div className="map">
      <ReactMapGL
        mapboxApiAccessToken={publicRuntimeConfig.mapboxAccessToken}
        width="100%"
        height="100%"
        {...viewport}
        interactiveLayerIds={layerIds}
        onViewportChange={viewport => setViewport(viewport)}
        onClick={onMapClick}
      >
        {layers}
        {popupInfo && <PopupInfo
          popupInfo={popupInfo}
          onClose={() => setPopupInfo(null)}
          setProjectModalProject={setProjectModalProject}
        />}
        <div className="nav" className="map-nav">
          <NavigationControl onViewportChange={viewport => setViewport(viewport)} />
        </div>
      </ReactMapGL>
      <style jsx>{`
        .map {
          clear: both;
          height: 350px;
        }

        .map-nav {
          position: absolute;
          top: 0;
          left: 0;
          padding: 10px;
        }
      `}</style>
    </div>
  )
}

export default ProjectsMap
