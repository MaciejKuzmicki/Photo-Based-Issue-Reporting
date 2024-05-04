import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createCustomIcon = (color) => {
    return L.icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="34" viewBox="0 0 24 24"><path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/></svg>`)}`,
        iconSize: [36, 51],
        iconAnchor: [12, 34],
        popupAnchor: [6, -34]
    });
};

const CustomMarker = ({ position, color = 'red', children }) => {
    const icon = createCustomIcon(color);
    return (
        <Marker position={position} icon={icon}>
            {children && <Popup>{children}</Popup>}
        </Marker>
    );
};

export default CustomMarker;
