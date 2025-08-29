import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

const userIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%234285f4" stroke="%23ffffff" stroke-width="3"/></svg>`
    ),
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Composant pour centrer la carte sur la position utilisateur
function LocationControl({ userLocation, mapRef }) {
  const map = useMap();
  
  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);
  
  return null;
}

// Utilitaire pour calculer la distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function MapScreen({ stands, onOpenStand }) {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const mapRef = useRef(null);

  // Obtenir toutes les catégories uniques
  const allCategories = [...new Set(stands.flatMap(s => s.categories || []))];

  // Filtrer les stands selon les catégories sélectionnées
  const filteredStands = selectedCategories.length > 0 
    ? stands.filter(s => s.categories?.some(cat => selectedCategories.includes(cat)))
    : stands;

  const withCoords = filteredStands.filter((s) => s?.location?.lat && s?.location?.lng);
  
  // Calculer les distances si l'utilisateur est géolocalisé
  const standsWithDistance = userLocation 
    ? withCoords.map(stand => ({
        ...stand,
        distanceKm: calculateDistance(
          userLocation.lat, userLocation.lng,
          stand.location.lat, stand.location.lng
        )
      })).sort((a, b) => a.distanceKm - b.distanceKm)
    : withCoords;

  const center = userLocation 
    ? [userLocation.lat, userLocation.lng]
    : withCoords.length
    ? [withCoords[0].location.lat, withCoords[0].location.lng]
    : [48.8566, 2.3522]; // Paris fallback

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        setUserLocation(location);
        setShowUserLocation(true);
        setIsLoading(false);
        
        // Centrer la carte sur la position utilisateur
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 13);
        }
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        setIsLoading(false);
        alert('Impossible d\'obtenir votre position');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <section className="screen map-screen">
      {/* En-tête avec contrôles */}
      <div className="map-header">
        <div className="map-controls">
          <button 
            className={`location-btn ${isLoading ? 'loading' : ''}`}
            onClick={getCurrentLocation}
            disabled={isLoading}
            title="Me localiser"
          >
            {isLoading ? '📍' : '🎯'}
            {isLoading ? 'Localisation...' : 'Me localiser'}
          </button>
          
          {userLocation && (
            <div className="location-info">
              📍 Position obtenue
            </div>
          )}
        </div>

        {standsWithDistance.length > 0 && (
          <div className="stands-count">
            {standsWithDistance.length} stand{standsWithDistance.length > 1 ? 's' : ''} trouvé{standsWithDistance.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filtres par catégorie */}
      {allCategories.length > 0 && (
        <div className="map-filters">
          <div className="filter-header">
            <span className="filter-title">Filtrer par catégorie</span>
            {selectedCategories.length > 0 && (
              <button className="clear-filters" onClick={clearFilters}>
                Effacer ({selectedCategories.length})
              </button>
            )}
          </div>
          <div className="filter-chips">
            {allCategories.map(category => (
              <button
                key={category}
                className={`filter-chip ${selectedCategories.includes(category) ? 'active' : ''}`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Carte */}
      <div className="map-wrapper">
        <MapContainer 
          center={center} 
          zoom={userLocation ? 13 : 12} 
          scrollWheelZoom={true} 
          className="map"
        >
          <LocationControl userLocation={userLocation} mapRef={mapRef} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marqueur de l'utilisateur */}
          {showUserLocation && userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="popup user-popup">
                  <strong>📍 Votre position</strong>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Marqueurs des stands */}
          {standsWithDistance.map((s) => (
            <Marker key={s.id} position={[s.location.lat, s.location.lng]} icon={redIcon}>
              <Popup>
                <div className="popup stand-popup">
                  <div className="popup-header">
                    <strong>{s.title}</strong>
                    {s.distanceKm && (
                      <span className="distance">📍 {s.distanceKm.toFixed(1)} km</span>
                    )}
                  </div>
                  
                  {s.location?.address && (
                    <div className="popup-address">📍 {s.location.address}</div>
                  )}
                  
                  {s.categories && s.categories.length > 0 && (
                    <div className="popup-categories">
                      {s.categories.map(cat => (
                        <span key={cat} className="popup-category">{cat}</span>
                      ))}
                    </div>
                  )}
                  
                  {s.priceFrom && (
                    <div className="popup-price">À partir de {s.priceFrom}€</div>
                  )}
                  
                  <div className="popup-actions">
                    <button className="primary" onClick={() => onOpenStand?.(s)}>
                      Voir le stand
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Informations utiles */}
      <div className="map-info-section">
        {/* Statistiques rapides */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{standsWithDistance.length}</div>
            <div className="stat-label">Stands visibles</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{allCategories.length}</div>
            <div className="stat-label">Catégories</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {userLocation && standsWithDistance.length > 0 
                ? `${Math.min(...standsWithDistance.map(s => s.distanceKm)).toFixed(1)}km`
                : '--'
              }
            </div>
            <div className="stat-label">Plus proche</div>
          </div>
        </div>

        {/* Liste des stands proches */}
        {userLocation && standsWithDistance.length > 0 && (
          <div className="nearby-stands">
            <h3 className="section-title">🎯 Stands les plus proches</h3>
            <div className="stands-list">
              {standsWithDistance.slice(0, 3).map(stand => (
                <div key={stand.id} className="stand-item" onClick={() => onOpenStand?.(stand)}>
                  <div className="stand-info">
                    <div className="stand-name">{stand.title}</div>
                    <div className="stand-details">
                      <span className="stand-distance">📍 {stand.distanceKm.toFixed(1)} km</span>
                      {stand.location?.address && (
                        <span className="stand-address">{stand.location.address}</span>
                      )}
                    </div>
                    {stand.categories && stand.categories.length > 0 && (
                      <div className="stand-categories">
                        {stand.categories.slice(0, 2).map(cat => (
                          <span key={cat} className="category-tag">{cat}</span>
                        ))}
                        {stand.categories.length > 2 && (
                          <span className="category-more">+{stand.categories.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="stand-price">
                    {stand.priceFrom ? `${stand.priceFrom}€+` : '--'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conseils et informations */}
        <div className="tips-section">
          <h3 className="section-title">💡 Conseils</h3>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">🎯</span>
              <span className="tip-text">Activez votre géolocalisation pour voir les distances</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🔍</span>
              <span className="tip-text">Utilisez les filtres pour trouver ce qui vous intéresse</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">📍</span>
              <span className="tip-text">Cliquez sur un marqueur pour voir les détails du stand</span>
            </div>
          </div>
        </div>

        {/* Légende de la carte */}
        <div className="map-legend">
          <h3 className="section-title">🗺️ Légende</h3>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-icon" style={{color: '#ff3b30'}}>📍</span>
              <span className="legend-text">Stands disponibles</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon" style={{color: '#4285f4'}}>🔵</span>
              <span className="legend-text">Votre position</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* État vide */}
      {standsWithDistance.length === 0 && selectedCategories.length > 0 && (
        <div className="empty-state">
          <p className="muted">Aucun stand trouvé pour les catégories sélectionnées.</p>
          <button className="secondary" onClick={clearFilters}>
            Voir tous les stands
          </button>
        </div>
      )}
      
      {withCoords.length === 0 && selectedCategories.length === 0 && (
        <div className="empty-state">
          <p className="muted">Aucun stand géolocalisé pour le moment.</p>
        </div>
      )}
    </section>
  );
}

export default MapScreen;
