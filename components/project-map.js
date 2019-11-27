import React, { useState } from 'react'
import ReactMapGL, { NavigationControl } from 'react-map-gl'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
import MapLayer from '../components/map-layer'
import { getViewport } from '../lib/util'

const ProjectMap = ({ project, grantees }) => {
  const { layers, bbox } = MapLayer([project], grantees)

  if (!layers.length) {
    return null
  }

  const [viewport, setViewport] = useState(getViewport(bbox))

  return (
    <div className="map">
      <ReactMapGL
        mapboxApiAccessToken={publicRuntimeConfig.mapboxAccessToken}
        width="100%"
        height="100%"
        {...viewport}
        onViewportChange={viewport => setViewport(viewport)}
      >
        {layers}
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
