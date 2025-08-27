import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import MediaCarousel from '../components/MediaCarousel';

function StandDetail({ stand, onBack }) {
  if (!stand) return null;
  const openMaps = () => {
    const q = encodeURIComponent(`${stand.title} ${stand.location?.address || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
  };
  const hasCoords = stand?.location?.lat && stand?.location?.lng;
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
  return (
    <section className="screen stand-detail">
      <button className="back-btn" onClick={onBack} aria-label="Retour">← Retour</button>
      <div className="detail__media">
        {stand.photos?.length ? (
          <MediaCarousel photos={stand.photos} altBase={stand.title} />
        ) : (
          <img src={stand.photos?.[0] || '/logo192.png'} alt={stand.title} />
        )}
      </div>
      <h1>{stand.title}</h1>
      <p className="muted">{stand.fair?.name} • {stand.distanceKm} km</p>
      <div className="tags">
        {stand.categories?.map((c) => <span key={c} className="tag">{c}</span>)}
      </div>
      <p>{stand.description}</p>
      <div className="detail__actions">
        <button className="primary" onClick={openMaps}>Itinéraire</button>
        <a className="secondary" href={`tel:+33123456789`}>Appeler</a>
      </div>
      <div className="detail__location">
        {hasCoords ? (
          <div className="mini-map" role="img" aria-label="Localisation du stand">
            <MapContainer center={[stand.location.lat, stand.location.lng]} zoom={14} className="mini-map__map" dragging={false} zoomControl={false} scrollWheelZoom={false} doubleClickZoom={false}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[stand.location.lat, stand.location.lng]} icon={redIcon} />
            </MapContainer>
          </div>
        ) : (
          <div className="mini-map">Carte à venir</div>
        )}
        <p className="muted">{stand.location?.address}</p>
      </div>
    </section>
  );
}

export default StandDetail;
