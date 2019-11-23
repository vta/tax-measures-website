import React, { useState } from 'react'
import ReactMapGL, { Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
import { every } from 'lodash'
import bbox from '@turf/bbox'
import Pin from './map-pin'

const ProjectMap = ({ project }) => {
  if ((!project.fields.Latitude || !project.fields.Longitude) && !project.fields.Geometry) {
    return null
  }

  const getInitialViewport = () => {
    if (project.fields.Latitude && project.fields.Longitude) {
      return {
        latitude: project.fields.Latitude,
        longitude: project.fields.Longitude,
        zoom: 12,
        bearing: 0,
        pitch: 0
      }
    } else if (project.fields.Geometry) {
      const [minLng, minLat, maxLng, maxLat] = bbox(project.fields.Geometry)

      return {
        latitude: (maxLat + minLat) / 2 ,
        longitude: (maxLng + minLng) / 2,
        zoom: 12,
        bearing: 0,
        pitch: 0
      }
    }
  }

  const [viewport, setViewport] = useState(getInitialViewport())

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
        />
      </Marker>
    )
  }

  const renderPolygon = geojson => (
    <Source
      type="geojson"
      key="fill"
      data={geojson}
    >
      <Layer
        id="data"
        type="fill"
        paint={{
          'fill-color': '#2D65B1',
          'fill-opacity': 0.8
        }}
      />
    </Source>
  )

  const renderLineString = geojson => (
    <Source
      type="geojson"
      key="line"
      data={geojson}
    >
      <Layer
        id="data"
        type="line"
        paint={{
          'line-color': '#2D65B1',
          'line-width': 3
        }}
      />
    </Source>
  ) 

  const renderGeography = project => {
    if (project.fields.Latitude && project.fields.Longitude) {
      return renderMarker(project, project.fields.Latitude, project.fields.Longitude)
    } else if (project.fields.Geometry) {
      const geojson = project.fields.Geometry

      if (geojson.type === 'FeatureCollection' && every(geojson.features, ['geometry.type', 'Point'])) {
        return (
          <React.Fragment key={project.id}>
            {geojson.features.map(feature => renderMarker(project, feature.geometry.coordinates[1], feature.geometry.coordinates[0]))}
          </React.Fragment>
        )
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
        
        return (
          <React.Fragment key={project.id}>
            {hasPolygon && renderPolygon(geojson)}
            {hasLineString && renderLineString(geojson)}
          </React.Fragment>
        )
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
        onViewportChange={viewport => setViewport(viewport)}
      >
        {renderGeography(project)}
        <div className="nav" className="map-nav">
          <NavigationControl onViewportChange={viewport => setViewport(viewport)} />
        </div>
      </ReactMapGL>
      <style jsx>{`
        .map {
          height: 200px;
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

export default ProjectMap
