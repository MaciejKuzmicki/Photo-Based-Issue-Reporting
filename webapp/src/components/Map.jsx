import {MapContainer, Popup, TileLayer} from "react-leaflet";
import {LocationExtractor} from "../utils/LocationExtractor";
import CustomMarker from "./CustomMarker";

function Map({defectsDetails}) {
    const center = [53.135271, 23.145703];
    return (
        <MapContainer center={center} zoom={13} style={{ height: '40rem', width: '80rem', borderRadius: '15px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {defectsDetails != null ?
                defectsDetails.map(defect => {
                    const { lat, lng, locationName, imageUrl } = LocationExtractor.extractLocationDetails(defect);
                    return (
                        <CustomMarker position={[lat, lng]} color={defect.isFixed ? "green" : "red"}>
                            <Popup>
                                <div>
                                    <strong>{locationName}</strong><br/>
                                    <img src={imageUrl} alt={locationName} style={{ minWidth: '10rem', maxWidth: '14rem' }} />
                                </div>
                            </Popup>
                        </CustomMarker>
                    );
                })
                : null}
        </MapContainer>
    );
}

export default Map;