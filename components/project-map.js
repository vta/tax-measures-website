import React, { useState } from 'react'
import ReactMapGL, {Marker, NavigationControl} from 'react-map-gl';
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
import Pin from './map-pin'

const ProjectMap = props => {
  const { results } = props
  const [viewport, setViewport] = useState({
    latitude: 37.432200,
    longitude: -121.953907,
    zoom: 9,
    bearing: 0,
    pitch: 0
  })

  const projectsWithGeo = results.projects.filter(project => {
    return !!project.fields.Latitude && !!project.fields.Longitude
  })

  const renderMarker = project => {
    return (
      <Marker
        longitude={project.fields.Longitude}
        latitude={project.fields.Latitude}
        offsetTop={-20}
        offsetLeft={-10}
      >
        <Pin size={20} />
      </Marker>
    )
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
        {projectsWithGeo.map(renderMarker)}
        <div className="nav" className="map-nav">
          <NavigationControl onViewportChange={viewport => setViewport(viewport)} />
        </div>
      </ReactMapGL>
      <style jsx>{`
        .map {
          clear: both;
          height: 325px;
          padding-top: 10px;
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
