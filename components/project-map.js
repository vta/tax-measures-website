import React, { useState, useRef } from 'react'
import ReactMapGL, { Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
import { every } from 'lodash'
import { formatCurrencyMillions } from '../lib/util'
import Pin from './map-pin'

const ProjectMap = props => {
  const { results } = props
  const [viewport, setViewport] = useState({
    latitude: 37.332200,
    longitude: -121.953907,
    zoom: 8.5,
    bearing: 0,
    pitch: 0
  })
  const [popupInfo, setPopupInfo] = useState(null)
  const mapRef = useRef()

  const onMapClick = event => {
    const {
      features,
      lngLat
    } = event

    const clickedFeature = features && features.find(f => f.layer.id === 'data');

    if (!clickedFeature || !clickedFeature.properties.projectId) {
      return
    }

    const project = results.projects.find(project => project.id === clickedFeature.properties.projectId)

    if (!project) {
      return
    }

    setPopupInfo({
      project,
      latitude: lngLat[1],
      longitude: lngLat[0]
    })
  }

  const renderMarker = (project, latitude, longitude) => {
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
            project,
            latitude,
            longitude
          })}
        />
      </Marker>
    )
  }

  const renderGeography = project => {
    if (project.fields.Latitude && project.fields.Longitude) {
      return renderMarker(project, project.fields.Latitude, project.fields.Longitude)
    } else if (project.fields.Geometry) {
      try {
        const geojson = JSON.parse(project.fields.Geometry)
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

        if (geojson.type === 'FeatureCollection' && every(geojson.features, ['geometry.type', 'Point'])) {
          return (
            <React.Fragment key={project.id}>
              {geojson.features.map(feature => renderMarker(project, feature.geometry.coordinates[1], feature.geometry.coordinates[0]))}
            </React.Fragment>
          )
        } else {
          const linePaint = {
            'line-color': '#2D65B1',
            'line-width': 3
          }

          const fillPaint = {
            'fill-color': '#2D65B1',
            'fill-opacity': 0.8
          }

          return (
            <React.Fragment key={project.id}>
              {hasLineString && <Source
                type="geojson"
                key="line"
                data={geojson}
              >
                <Layer id="data" type="line" paint={linePaint} />
              </Source>}
              {hasPolygon && <Source
                type="geojson"
                key="fill"
                data={geojson}
              >
                <Layer id="data" type="fill" paint={fillPaint} />
              </Source>}
            </React.Fragment>
          )
        }
      } catch (err) {
        console.warn(`Invalid geometry for project "${project.fields.Name}"`)
        console.warn(project.fields.Geometry)
        console.warn(err)
      }
    }

    return null
  }

  return (
    <div className="map">
      <ReactMapGL
        mapboxApiAccessToken={publicRuntimeConfig.mapboxAccessToken}
        width="100%"
        height="100%"
        {...viewport}
        interactiveLayerIds={["data"]}
        onViewportChange={viewport => setViewport(viewport)}
        onClick={onMapClick}
        ref={mapRef}
      >
        {results.projects.map(renderGeography)}
        {popupInfo && <Popup
          offsetTop={-20}
          latitude={popupInfo.latitude}
          longitude={popupInfo.longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setPopupInfo(null)}
          anchor="bottom"
        >
          <div className="popup-title">{popupInfo.project.fields.Name}</div>
          <div className="popup-stat">
            Category: {popupInfo.project.fields.Category.fields.Name}
          </div>
          <div className="popup-stat">
            Grantee: {popupInfo.project.fields['Grantee Name']}
          </div>
          <div className="popup-stat">
            Total Allocations: {`${formatCurrencyMillions(popupInfo.project.fields.totalAllocationAmount)}m`}
          </div>
          <div className="popup-stat">
            Total Payments: {`${formatCurrencyMillions(popupInfo.project.fields.totalPaymentAmount)}m`}
          </div>
        </Popup>}
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

        .popup-title {
          margin-right: 14px;
          color: #2D65B1;
        }
      `}</style>
    </div>
  )
}

export default ProjectMap
