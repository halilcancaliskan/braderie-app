import React from 'react';
import { createStand, uploadImage } from '../lib/firebase';

function Publish() {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [lat, setLat] = React.useState('');
  const [lng, setLng] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const [geoLoading, setGeoLoading] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [previews, setPreviews] = React.useState([]);

  const useMyLocation = async () => {
    if (!('geolocation' in navigator)) {
      setMsg("La géolocalisation n'est pas supportée par ce navigateur.");
      return;
    }
    setGeoLoading(true); setMsg('');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setLat(String(latitude));
      setLng(String(longitude));
      // Reverse geocode (best-effort) using Nominatim
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          if (data?.display_name) setAddress(data.display_name);
        }
      } catch {}
      setGeoLoading(false);
    }, (err) => {
      setGeoLoading(false);
      setMsg('Impossible de récupérer la position: ' + (err?.message || ''));
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      // Upload selected images concurrently; continue even if some fail
      let photos = [];
      if (files.length) {
        const results = await Promise.allSettled(
          files.map((f) => uploadImage(f, { prefix: 'stands' }))
        );
        photos = results
          .filter((r) => r.status === 'fulfilled' && r.value?.url)
          .map((r) => r.value.url);
        if (photos.length === 0 && files.length > 0) {
          setMsg('Erreur lors de l\'upload des photos. L\'annonce sera publiée sans photos.');
        }
      }
      await createStand({
        title,
        description: desc,
        priceFrom: Number(price) || 0,
        photos,
        location: {
          lat: lat ? Number(lat) : null,
          lng: lng ? Number(lng) : null,
          address
        }
      });
      setMsg('✅ Annonce publiée avec succès !');
      setTitle(''); setDesc(''); setPrice(''); setAddress(''); setLat(''); setLng(''); setFiles([]); setPreviews([]);
    } catch (err) {
      setMsg('❌ Erreur: ' + (err?.message || 'inconnue'));
    } finally {
      setLoading(false);
    }
  };

  const onPickFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list.slice(0, 10));
    const urls = list.slice(0, 10).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  return (
    <section className="screen publish">
      <h1>Publier une annonce</h1>
      <form className="form" onSubmit={submit}>
        <label>
          Titre de votre annonce *
          <input 
            type="text"
            value={title} 
            onChange={(e)=>setTitle(e.target.value)} 
            placeholder="Ex: Vide-grenier, Braderie vintage..."
            required 
          />
        </label>
        
        <label>
          Description
          <textarea 
            value={desc} 
            onChange={(e)=>setDesc(e.target.value)} 
            rows={4}
            placeholder="Décrivez votre stand, les articles proposés..."
          />
        </label>
        
        <label>
          Photos de votre stand
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            multiple 
            onChange={onPickFiles} 
          />
          {previews.length > 0 && (
            <div className="photo-grid">
              {previews.map((src, i) => (
                <img key={i} src={src} alt={`Prévisualisation ${i+1}`} />
              ))}
            </div>
          )}
          <div className="note">
            📸 Jusqu'à 10 photos • Utilisez l'appareil photo pour de meilleurs résultats
          </div>
        </label>
        
        <label>
          Prix de départ (€)
          <input 
            type="number" 
            inputMode="decimal" 
            value={price} 
            onChange={(e)=>setPrice(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </label>
        
        <label>
          Localisation *
          <input 
            type="text"
            value={address} 
            onChange={(e)=>setAddress(e.target.value)} 
            placeholder="Adresse de votre stand"
            required
          />
        </label>
        
        <button 
          className="secondary" 
          type="button" 
          onClick={useMyLocation} 
          disabled={geoLoading}
        >
          {geoLoading ? (
            <>⏳ Localisation en cours...</>
          ) : (
            <>📍 Utiliser ma position actuelle</>
          )}
        </button>
        
        <div className="row">
          <label>
            Latitude
            <input 
              type="number" 
              inputMode="decimal" 
              value={lat} 
              onChange={(e)=>setLat(e.target.value)}
              placeholder="Auto"
              step="any"
            />
          </label>
          <label>
            Longitude
            <input 
              type="number" 
              inputMode="decimal" 
              value={lng} 
              onChange={(e)=>setLng(e.target.value)}
              placeholder="Auto"
              step="any"
            />
          </label>
        </div>
        
        <button className="primary" type="submit" disabled={loading || !title.trim()}>
          {loading ? (
            <>⏳ Publication en cours...</>
          ) : (
            <>🚀 Publier mon annonce</>
          )}
        </button>
      </form>
      
      {msg && (
        <div className="muted" role="status" aria-live="polite">
          {msg}
        </div>
      )}
    </section>
  );
}

export default Publish;
