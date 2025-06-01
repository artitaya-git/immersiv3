import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import GalleryPage from './GalleryPage';
import PortalPage from './PortalPage';
import About from './About';
import Roadmap from './Roadmap';
import FAQ from './FAQ';
import ARPage from './ARPage';
import VRPage from './VRPage';

/**
 * App Component: The main application component.
 *
 * This component sets up the React Router configuration for the entire application.
 */
function App() {
  // const [page, setPage] = useState<PageType>('landing'); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/gallery"
          element={
            <GalleryPage
            />
          }
        />
        <Route path="/ar-rotate" element={<ARPage/>} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/vr" element={<VRPage />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
}

export default App;