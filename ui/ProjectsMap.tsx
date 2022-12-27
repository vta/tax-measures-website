import { useState, useCallback } from 'react';
import ReactMapGL, { NavigationControl } from 'react-map-gl';
import { MapLayer } from '#/ui/MapLayer';
import { getViewport } from '#/lib/util.js';

export const ProjectsMap = ({
  data: { grantees },
  geojsons,
  projectsToMap,
  setProjectModalProjects,
  height,
}) => {
  const [cursor, setCursor] = useState('auto');
  /* eslint-disable-next-line new-cap */
  const { layers, layerIds, bbox } = MapLayer(
    projectsToMap,
    geojsons,
    grantees
  );
  const viewport = getViewport(bbox);

  const onMapClick = (event) => {
    const { features } = event;

    const projectIds = new Set(features.map((f) => f.properties.projectId));
    const filteredProjects = projectsToMap.filter((project) =>
      projectIds.has(project.id)
    );

    if (filteredProjects.length === 0) {
      return;
    }

    setProjectModalProjects(filteredProjects);
  };

  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);

  if (!geojsons) {
    return null;
  }

  if (layers.length === 0) {
    return (
      <div>
        <p>&nbsp;</p>
        <div className="text-center font-weight-bold mt-5">
          No map available
        </div>
      </div>
    );
  }

  return (
    <div className="map" style={{ height }}>
      <ReactMapGL
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={viewport}
        interactiveLayerIds={layerIds}
        onClick={onMapClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        cursor={cursor}
        scrollZoom={false}
        mapStyle="mapbox://styles/mapbox/light-v9"
        style={{ width: '100%', height: '100%' }}
      >
        {layers}
        <div className="nav map-nav">
          <NavigationControl />
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
  );
};
