import React from 'react'
import { Layer, Source } from 'react-map-gl'
import bbox from '@turf/bbox'
import { mergeBboxes } from '../lib/util'

const MapLayer = (projects) => {
  const layerIds = []
  const bboxes = []
  const layers = projects.reduce((memo, project) => {
    let geojson

    if (project.fields.Latitude && project.fields.Longitude) {
      geojson = {
        type: 'Feature',
        properties: {
          projectId: project.id
        },
        geometry: {
          type: 'Point',
          coordinates: [
            project.fields.Longitude,
            project.fields.Latitude
          ]
        }
      }
    } else if (project.fields.Geometry) {
      geojson = project.fields.Geometry
    } else {
      return memo
    }

    let hasLineString = false
    let hasPolygon = false
    let hasPoint = false

    if (geojson.type === 'Feature') {
      geojson.properties.projectId = project.id
      if (geojson.geometry.type === 'LineString') {
        hasLineString = true
      }
      if (geojson.geometry.type === 'MultiPolygon' || geojson.geometry.type === 'Polygon') {
        hasPolygon = true
      }
      if (geojson.geometry.type === 'Point') {
        hasPoint = true
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
        if (feature.geometry.type === 'Point') {
          hasPoint = true
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
            'fill-opacity': 0.8,
            'fill-outline-color': '#2D65B1',
          }}
        />
      </Source>)
      layerIds.push(layerId)

      const outlineLayerId = `${project.id}filloutline`
      memo.push(<Source
        type="geojson"
        key={outlineLayerId}
        data={geojson}
      >
        <Layer
          id={outlineLayerId}
          type="line"
          paint={{
            'line-color': '#2D65B1',
            'line-width': 4
          }}
        />
      </Source>)
      layerIds.push(outlineLayerId)
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
            'line-width': 4
          }}
        />
      </Source>)
      layerIds.push(layerId)
    }

    if (hasPoint) {
      const layerId = `${project.id}circle`
      memo.push(<Source
        type="geojson"
        key={layerId}
        data={geojson}
      >
        <Layer
          id={layerId}
          type="circle"
          paint={{
            'circle-color': '#2D65B1',
            'circle-opacity': 0.8,
            'circle-radius': {
              'base': 1.75,
              'stops': [[10, 2], [22, 180]]
            },
            'circle-stroke-width': 2,
            'circle-stroke-color': '#2D65B1',
          }}
        />
      </Source>)
      layerIds.push(layerId)
    }

    bboxes.push(bbox(geojson))

    return memo
  }, [])

  return {
    layers,
    layerIds,
    bbox: mergeBboxes(bboxes)
  }
}

export default MapLayer
