import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import BottomBar from './components/BottomBar';
import Discover from './screens/Discover';
import Publish from './screens/Publish';
import Favorites from './screens/Favorites';
import Profile from './screens/Profile';
import { sampleStands } from './data/stands';
import { subscribeToStands } from './lib/firebase';
import SideDrawer from './components/SideDrawer';

const MapScreen = React.lazy(() => import('./screens/MapScreen'));
const StandDetail = React.lazy(() => import('./screens/StandDetail'));

function App() {
  const [activeTab, setActiveTab] = React.useState('discover');
  const [stands, setStands] = React.useState(sampleStands);
  const [favorites, setFavorites] = React.useState([]);
  const [openedStand, setOpenedStand] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [userCity, setUserCity] = React.useState(() => {
    const saved = localStorage.getItem('userCity');
    return saved || '';
  });
  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const tabs = [
    { key: 'discover', label: 'Découvrir', icon: '🏠' },
    { key: 'publish', label: 'Publier', icon: '➕' },
    { key: 'map', label: 'Carte', icon: '🗺️' },
  ];

  const toggleFav = (id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const titleMap = {
    discover: 'Braderie Finder',
    publish: 'Publier',
    map: 'Carte',
    favorites: 'Favoris',
    profile: 'Profil',
    detail: openedStand?.title || 'Stand'
  };

  const showMain = openedStand == null;

  // Subscribe to realtime stands (skip during tests)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'test') return; // prevent jest env network calls
    const unsub = subscribeToStands((arr) => setStands(arr.length ? arr : sampleStands));
    return () => typeof unsub === 'function' && unsub();
  }, []);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const navigateFromDrawer = (key) => { setActiveTab(key); setDrawerOpen(false); };

  const openFavorites = () => { setOpenedStand(null); setActiveTab('favorites'); };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Apply dark mode class to document
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const updateUserCity = (city) => {
    setUserCity(city);
    localStorage.setItem('userCity', city);
  };

  return (
    <div className="app-shell">
      <Navbar
        title={titleMap[showMain ? activeTab : 'detail']}
        leftSlot={(
          <button
            className="icon-btn"
            aria-label="Menu"
            title="Menu"
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            aria-controls="app-drawer"
            onClick={openDrawer}
          >
            <span className="icon icon--hamburger" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>
        )}
        rightSlot={(
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className="icon-btn" 
              aria-label={darkMode ? "Mode clair" : "Mode sombre"} 
              title={darkMode ? "Mode clair" : "Mode sombre"}
              onClick={toggleDarkMode}
            >
              <span aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
            </button>
            <button className="icon-btn" aria-label="Favoris" title="Favoris" onClick={openFavorites}>
              <span className="bottombar__icon" aria-hidden>❤️</span>
            </button>
          </div>
        )}
      />

      <React.Suspense fallback={<main className="app-content" role="main"><p className="muted">Chargement…</p></main>}>
        <main className="app-content" role="main">
          {showMain ? (
            <>
              {activeTab === 'discover' && (
                <Discover
                  stands={stands}
                  favorites={favorites}
                  onToggleFav={toggleFav}
                  onOpenStand={setOpenedStand}
                  userCity={userCity}
                  onCityChange={updateUserCity}
                />
              )}
              {activeTab === 'map' && (
                <MapScreen stands={stands} onOpenStand={setOpenedStand} />
              )}
              {activeTab === 'publish' && (
                <Publish />
              )}
              {activeTab === 'favorites' && (
                <Favorites
                  stands={stands}
                  favorites={favorites}
                  onToggleFav={toggleFav}
                  onOpenStand={setOpenedStand}
                />
              )}
              {activeTab === 'profile' && (
                <Profile />
              )}
            </>
          ) : (
            <StandDetail stand={openedStand} onBack={() => setOpenedStand(null)} />
          )}
        </main>
      </React.Suspense>

      <BottomBar tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

      <SideDrawer open={drawerOpen} onClose={closeDrawer} onNavigate={navigateFromDrawer} />
    </div>
  );
}

export default App;
