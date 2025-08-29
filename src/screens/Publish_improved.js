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
  const [msgType, setMsgType] = React.useState(''); // 'success', 'error', 'info'
  const [geoLoading, setGeoLoading] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [previews, setPreviews] = React.useState([]);
  const [step, setStep] = React.useState(1); // Multi-step form: 1=info, 2=photos, 3=location

  const useMyLocation = async () => {
    if (!('geolocation' in navigator)) {
      setMsg("🚫 La géolocalisation n'est pas supportée par ce navigateur.");
      setMsgType('error');
      return;
    }
    setGeoLoading(true); 
    setMsg('🔍 Recherche de votre position...');
    setMsgType('info');
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setLat(String(latitude));
      setLng(String(longitude));
      
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          if (data?.display_name) {
            setAddress(data.display_name);
            setMsg('📍 Position trouvée avec succès !');
            setMsgType('success');
          }
        }
      } catch {
        setMsg('📍 Position trouvée (adresse non résolue)');
        setMsgType('success');
      }
      setGeoLoading(false);
    }, (err) => {
      setGeoLoading(false);
      setMsg('❌ Impossible de récupérer la position: ' + (err?.message || ''));
      setMsgType('error');
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setMsg('⏳ Publication en cours...');
    setMsgType('info');
    
    try {
      let photos = [];
      if (files.length) {
        setMsg('📤 Upload des photos...');
        const results = await Promise.allSettled(
          files.map((f) => uploadImage(f, { prefix: 'stands' }))
        );
        photos = results
          .filter((r) => r.status === 'fulfilled' && r.value?.url)
          .map((r) => r.value.url);
        
        if (photos.length === 0 && files.length > 0) {
          setMsg('⚠️ Erreur lors de l\'upload des photos. L\'annonce sera publiée sans photos.');
          setMsgType('error');
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
      
      setMsg('🎉 Annonce publiée avec succès !');
      setMsgType('success');
      setTitle(''); setDesc(''); setPrice(''); setAddress(''); setLat(''); setLng(''); 
      setFiles([]); setPreviews([]); setStep(1);
      
      // Clear success message after 3 seconds
      setTimeout(() => setMsg(''), 3000);
      
    } catch (err) {
      setMsg('❌ Erreur: ' + (err?.message || 'inconnue'));
      setMsgType('error');
    } finally {
      setLoading(false);
    }
  };

  const onPickFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list.slice(0, 10));
    const urls = list.slice(0, 10).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    if (list.length > 0) {
      setMsg(`📸 ${list.length} photo(s) sélectionnée(s)`);
      setMsgType('success');
    }
  };

  const removePhoto = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    URL.revokeObjectURL(previews[index]); // Clean up memory
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return title.trim() && desc.trim();
      case 2: return true; // Photos are optional
      case 3: return address.trim();
      default: return false;
    }
  };

  return (
    <section className="screen publish">
      <div className="publish-header">
        <h1>✨ Publier une annonce</h1>
        <p className="publish-subtitle">Partagez votre braderie avec la communauté</p>
        
        {/* Progress indicator */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Infos</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Photos</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Localisation</span>
          </div>
        </div>
      </div>

      <form className="publish-form" onSubmit={submit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="form-step">
            <div className="step-header">
              <h2>📝 Informations de base</h2>
              <p>Décrivez votre braderie en quelques mots</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Titre de votre annonce *</span>
                <input 
                  type="text"
                  value={title} 
                  onChange={(e)=>setTitle(e.target.value)} 
                  placeholder="Ex: Vide-grenier vintage, Braderie enfants..."
                  className="form-input"
                  required 
                />
              </label>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Description *</span>
                <textarea 
                  value={desc} 
                  onChange={(e)=>setDesc(e.target.value)} 
                  rows={4}
                  placeholder="Décrivez les articles que vous proposez, l'ambiance de votre stand..."
                  className="form-textarea"
                  required
                />
              </label>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Prix de départ (€)</span>
                <input 
                  type="number" 
                  inputMode="decimal" 
                  value={price} 
                  onChange={(e)=>setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </label>
              <div className="form-hint">💡 Prix minimum ou laissez vide pour "À négocier"</div>
            </div>
          </div>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <div className="form-step">
            <div className="step-header">
              <h2>📸 Photos de votre stand</h2>
              <p>Ajoutez des photos pour attirer plus de visiteurs</p>
            </div>
            
            <div className="photo-upload-zone">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                multiple 
                onChange={onPickFiles}
                className="photo-input"
                id="photo-input"
              />
              <label htmlFor="photo-input" className="photo-upload-label">
                <div className="upload-icon">📷</div>
                <div className="upload-text">
                  <strong>Choisir des photos</strong>
                  <span>ou utiliser l'appareil photo</span>
                </div>
              </label>
            </div>
            
            {previews.length > 0 && (
              <div className="photo-gallery">
                {previews.map((src, i) => (
                  <div key={i} className="photo-item">
                    <img src={src} alt={`Photo ${i+1}`} />
                    <button 
                      type="button" 
                      className="photo-remove"
                      onClick={() => removePhoto(i)}
                      aria-label={`Supprimer la photo ${i+1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="form-hint">
              📱 Jusqu'à 10 photos • Format recommandé: carré ou paysage
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="form-step">
            <div className="step-header">
              <h2>📍 Localisation</h2>
              <p>Où les visiteurs peuvent-ils vous trouver ?</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Adresse complète *</span>
                <input 
                  type="text"
                  value={address} 
                  onChange={(e)=>setAddress(e.target.value)} 
                  placeholder="Rue, ville, code postal..."
                  className="form-input"
                  required
                />
              </label>
            </div>
            
            <button 
              className="location-btn" 
              type="button" 
              onClick={useMyLocation} 
              disabled={geoLoading}
            >
              {geoLoading ? (
                <>⏳ Localisation en cours...</>
              ) : (
                <>🎯 Utiliser ma position actuelle</>
              )}
            </button>
            
            <div className="coordinates-row">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Latitude</span>
                  <input 
                    type="number" 
                    inputMode="decimal" 
                    value={lat} 
                    onChange={(e)=>setLat(e.target.value)}
                    placeholder="Auto"
                    step="any"
                    className="form-input form-input-sm"
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Longitude</span>
                  <input 
                    type="number" 
                    inputMode="decimal" 
                    value={lng} 
                    onChange={(e)=>setLng(e.target.value)}
                    placeholder="Auto"
                    step="any"
                    className="form-input form-input-sm"
                  />
                </label>
              </div>
            </div>
            
            <div className="form-hint">
              🗺️ Les coordonnées sont remplies automatiquement avec votre position
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="form-navigation">
          {step > 1 && (
            <button type="button" className="btn-secondary" onClick={prevStep}>
              ← Précédent
            </button>
          )}
          
          {step < 3 ? (
            <button 
              type="button" 
              className="btn-primary" 
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Suivant →
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn-publish" 
              disabled={loading || !canProceed()}
            >
              {loading ? (
                <>⏳ Publication...</>
              ) : (
                <>🚀 Publier mon annonce</>
              )}
            </button>
          )}
        </div>
      </form>
      
      {/* Status messages */}
      {msg && (
        <div className={`status-message ${msgType}`} role="status" aria-live="polite">
          {msg}
        </div>
      )}
    </section>
  );
}

export default Publish;
