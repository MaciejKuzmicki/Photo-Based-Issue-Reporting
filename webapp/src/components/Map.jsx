import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {useState} from "react";
import {LocationExtractor} from "../utils/LocationExtractor";

function Map({defectsDetails}) {
    const center = [53.12747, 23.0741015];
    return (
        <MapContainer center={center} zoom={13} style={{ height: '800px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {defectsDetails.map(defect => {
                const { lat, lng, locationName, imageUrl } = LocationExtractor.extractLocationDetails(defect);
                return (
                    <Marker key={defect.id} position={[lat, lng]}>
                        <Popup>
                            <div>
                                <strong>{locationName}</strong><br/>
                                <img src={imageUrl} alt={locationName} style={{width: "100%"}}/>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

export default Map;