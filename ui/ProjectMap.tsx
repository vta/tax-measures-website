'use client';

import ReactMapGL, { NavigationControl } from 'react-map-gl/mapbox';
import { MapLayer } from '#/ui/MapLayer';
import { getViewport } from '#/lib/util.js';
import { Slideshow } from '#/ui/Slideshow';

export const ProjectMap = ({ project, geojsons, images }) => {
  /* eslint-disable-next-line new-cap */
  const { layers, bbox } = MapLayer([project], geojsons);
  const viewport = getViewport(bbox);

  // Fall back to slideshow if project does not have spatial data
  if (!geojsons || layers.length === 0) {
    return (
      <Slideshow
        images={images.filter((image) =>
          project.fields.Images?.includes(image.id),
        )}
      />
    );
  }

  return (
    <div className="map">
      <ReactMapGL
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={viewport}
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
          height: 200px;
        }

        .map-nav {
          position: absolute;
          top: 0;
          left: 0;
          padding: 10px;
        }

        @media print {
          .map {
            height: 600px;
          }
        }
      `}</style>
    </div>
  );
};
