import React, { useState } from 'react'
import ReactMapGL, { Marker, NavigationControl, Popup } from 'react-map-gl';
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
  const [popupInfo, setPopupInfo] = useState(null)

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
        key={project.id}
      >
        <Pin
          size={20}
          color="#2D65B1"
          onClick={() => setPopupInfo(project)}
        />
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
        {popupInfo && <Popup
          offsetTop={-20}
          latitude={popupInfo.fields.Latitude}
          longitude={popupInfo.fields.Longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setPopupInfo(null)}
          anchor="bottom"
        >
          <div className="popup-title">{popupInfo.fields.Name}</div>
        </Popup>}
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

        .popup-title {
          margin-right: 14px;
        }
      `}</style>
    </div>
  )
}

export default ProjectMap
