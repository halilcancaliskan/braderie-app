import React from 'react';
import { saveUser } from '../lib/firebase';
import { getLocalUid } from '../lib/localId';

function Profile() {
  const uid = getLocalUid();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [city, setCity] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const save = async (e) => {
    e.preventDefault(); setMsg(''); setLoading(true);
    try {
      await saveUser(uid, { name, phone, city });
      setMsg('Profil enregistré.');
    } catch (err) {
      setMsg('Erreur: ' + (err?.message || 'inconnue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="screen profile">
      <h1>Profil</h1>
      <form className="form" onSubmit={save}>
        <label>Nom<input value={name} onChange={(e)=>setName(e.target.value)} /></label>
        <label>Téléphone<input value={phone} onChange={(e)=>setPhone(e.target.value)} inputMode="tel" /></label>
        <label>Ville<input value={city} onChange={(e)=>setCity(e.target.value)} /></label>
        <button className="primary" type="submit" disabled={loading}>{loading ? 'Enregistrement…' : 'Enregistrer'}</button>
      </form>
      {msg && <p className="muted" role="status">{msg}</p>}
      <ul className="list-simple">
        <li>Mes annonces</li>
        <li>Mes favoris</li>
        <li>Paramètres</li>
        <li>Aide</li>
      </ul>
    </section>
  );
}

export default Profile;
