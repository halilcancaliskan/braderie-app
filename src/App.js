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

  const tabs = [
    { key: 'discover', label: 'Découvrir', icon: '🏠' },
    { key: 'publish', label: 'Publier', icon: '➕' },
    { key: 'map', label: 'Carte', icon: '🗺️' },
  ];

  const toggleFav = (id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const titleMap = {
    discover: 'Découvrir',
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
          <button className="icon-btn" aria-label="Favoris" title="Favoris" onClick={openFavorites}>
            <span className="bottombar__icon" aria-hidden>❤️</span>
          </button>
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
