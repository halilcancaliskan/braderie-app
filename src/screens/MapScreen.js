import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const redIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 384 512"><path fill="%23ff3b30" d="M215.7 499.2C267 435 384 279.4 384 192 384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2 12.3 15.3 35.1 15.3 47.4 0zM192 272c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/></svg>`
    ),
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -28],
});

function MapScreen({ stands, onOpenStand }) {
  const withCoords = stands.filter((s) => s?.location?.lat && s?.location?.lng);
  const center = withCoords.length
    ? [withCoords[0].location.lat, withCoords[0].location.lng]
    : [48.8566, 2.3522]; // Paris fallback

  return (
    <section className="screen map-screen">
      <div className="map-wrapper">
        <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {withCoords.map((s) => (
            <Marker key={s.id} position={[s.location.lat, s.location.lng]} icon={redIcon}>
              <Popup>
                <div className="popup">
                  <strong>{s.title}</strong>
                  <div style={{ marginTop: 6 }}>
                    <button className="primary" onClick={() => onOpenStand?.(s)}>Voir</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {withCoords.length === 0 && (
        <p className="muted">Aucun stand géolocalisé pour le moment.</p>
      )}
    </section>
  );
}

export default MapScreen;
