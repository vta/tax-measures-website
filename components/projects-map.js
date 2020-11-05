import React, { useState } from 'react'
import { useRouter } from 'next/router'
import ReactMapGL, { NavigationControl } from 'react-map-gl'
import MapLayer from '../components/map-layer'
import { getViewport } from '../lib/util'
import { trans } from '../lib/translations'

const ProjectsMap = ({ data: { grantees }, geojsons, projectsToMap, setProjectModalProjects, height }) => {
  const router = useRouter()
  const { locale } = router

  if (!geojsons) {
    return null
  }

  const onMapClick = event => {
    const { features } = event

    const projectIds = new Set(features.map(f => f.properties.projectId))
    const filteredProjects = projectsToMap.filter(project => projectIds.has(project.id))

    if (filteredProjects.length === 0) {
      return
    }

    setProjectModalProjects(filteredProjects)
  }

  /* eslint-disable-next-line new-cap */
  const { layers, layerIds, bbox } = MapLayer(projectsToMap, geojsons, grantees)
  const [viewport, setViewport] = useState(getViewport(bbox))

  if (layers.length === 0) {
    return (
      <div>
        <p>&nbsp;</p>
        <div className="text-center font-weight-bold mt-5">{trans('projectsmap-no-map', locale)}</div>
      </div>
    )
  }

  return (
    <div className="map" style={{ height }}>
      <ReactMapGL
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        width="100%"
        height="100%"
        {...viewport}
        interactiveLayerIds={layerIds}
        onViewportChange={viewport => setViewport(viewport)}
        onClick={onMapClick}
        scrollZoom={false}
      >
        {layers}
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
