import React, { useState } from 'react'
import ReactMapGL, { Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
import { every } from 'lodash'
import { formatCurrencyWithUnit } from '../lib/util'
import Pin from './map-pin'

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

const ProjectsMap = ({ results, setProjectModalProject }) => {
  const [viewport, setViewport] = useState({
    latitude: 37.332200,
    longitude: -121.953907,
    zoom: 8.5,
    bearing: 0,
    pitch: 0
  })
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

  const MapMarker = ({project, latitude, longitude}) => {
    return (
      <Marker
        longitude={longitude}
        latitude={latitude}
        offsetTop={-20}
        offsetLeft={-10}
        key={`${project.id}${latitude}${longitude}`}
      >
        <Pin
          size={20}
          color="#2D65B1"
          onClick={() => setPopupInfo({
            projects: [project],
            latitude,
            longitude
          })}
        />
      </Marker>
    )
  }

  const layerIds = []

  const layers = results.projects.reduce((memo, project) => {
    if (project.fields.Latitude && project.fields.Longitude) {
      memo.push(<MapMarker
        project={project}
        latitude={project.fields.Latitude}
        longitude={project.fields.Longitude}
        key={project.id}
      />)
    } else if (project.fields.Geometry) {
      const geojson = project.fields.Geometry

      if (geojson.type === 'FeatureCollection' && every(geojson.features, ['geometry.type', 'Point'])) {
        memo.push(...geojson.features.map((feature, index) => <MapMarker
          project={project}
          latitude={feature.geometry.coordinates[1]}
          longitude={feature.geometry.coordinates[0]}
          key={`${project.id}-${index}`}
        />
        ))
      } else {
        let hasLineString = false
        let hasPolygon = false
  
        if (geojson.type === 'Feature') {
          geojson.properties.projectId = project.id
          if (geojson.geometry.type === 'LineString') {
            hasLineString = true
          }
          if (geojson.geometry.type === 'MultiPolygon' || geojson.geometry.type === 'Polygon') {
            hasPolygon = true
          }
        } else if (geojson.type === 'FeatureCollection') {
          for (const feature of geojson.features) {
            feature.properties.projectId = project.id
            if (feature.geometry.type === 'LineString') {
              hasLineString = true
            }
            if (feature.geometry.type === 'MultiPolygon' || feature.geometry.type === 'Polygon') {
              hasPolygon = true
            }
          }
        }
        
        if (hasPolygon) {
          const layerId = `${project.id}fill`
          memo.push(<Source
            type="geojson"
            key={layerId}
            data={geojson}
          >
            <Layer
              id={layerId}
              type="fill"
              paint={{
                'fill-color': '#2D65B1',
                'fill-opacity': 0.8
              }}
            />
          </Source>)
          layerIds.push(layerId)
        }

        if (hasLineString) {
          const layerId = `${project.id}line`
          memo.push(<Source
            type="geojson"
            key={layerId}
            data={geojson}
          >
            <Layer
              id={layerId}
              type="line"
              paint={{
                'line-color': '#2D65B1',
                'line-width': 3
              }}
            />
          </Source>)
          layerIds.push(layerId)
        }
      }
    }

    return memo
  }, [])

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
