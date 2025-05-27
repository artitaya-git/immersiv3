import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './LandingPage';
import GalleryPage from './GalleryPage';
import PortalPage from './PortalPage';
// import MintedPage from './MintedPage';
import ZkLoginPage from './ZkLoginPage';
import About from './About';
import Roadmap from './Roadmap';
import ARPage from './ARPage';
import VRPage from './VRPage'; 

// Define a type for the page state
type PageType = 'landing' | 'gallery' | 'minted';

/**
 * App Component: The main application component.
 *
 * This component sets up the React Router configuration for the entire application,
 * defining the different routes and their corresponding components.  It also manages
 * global state for the current page and whether to show the zkLogin modal.
 */
function App() {
  const [page, setPage] = useState<PageType>('landing'); // State for the landing page
  const [showZkLogin, setShowZkLogin] = useState(false); // State to control zkLogin modal visibility

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/gallery"
          element={
            <GalleryPage
              setPage={setPage}
              setShowZkLogin={setShowZkLogin}
              showZkLogin={showZkLogin} // Send state to GalleryPage
            />
          }
        />
        {/* <Route path="/minted" element={<MintedPage setPage={setPage} />} /> */}
        <Route path="/zk" element={<ZkLoginPage setShowZkLogin={setShowZkLogin} />} />
        <Route path="/ar-rotate" element={<ARPage/>} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/vr" element={<VRPage />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
    </Router>
  );
}

export default App;