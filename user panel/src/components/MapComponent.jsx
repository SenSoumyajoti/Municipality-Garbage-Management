// MapComponent.jsx
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, ZoomControl } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { Children, useEffect, useState } from 'react';

const MapComponent = ({ position = {lat: 23.207594, lng: 87.027532}, zoom = 16, allowWheelZoom = true, allowDblClickZoom = true, allowDragging = true, children }) => {
  return (
    <>
        <MapContainer
          className='map z-0'
          center={[position.lat, position.lng]} zoom={zoom}
          zoomControl={false}
          attributionControl={false}
          scrollWheelZoom={allowWheelZoom}
          doubleClickZoom={allowDblClickZoom}
          dragging={allowDragging}
          style={{height: '100%', width: '100%'}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {children}
        </MapContainer>
    </>
  );
};

export default MapComponent;
