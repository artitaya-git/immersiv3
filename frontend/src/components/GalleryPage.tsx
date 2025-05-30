import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import PortalPage from './PortalPage';
import About from './About';
import Slogans from './Slogans';
import Roadmap from './Roadmap';
import FAQ from './FAQ';
import Footer from './Footer';
import Navbar from './Navbar';
import ZkLoginPage from './ZkLoginPage';


interface GalleryPageProps {
  setPage: (page: 'landing' | 'gallery' | 'minted') => void;
  setShowZkLogin: (show: boolean) => void;
  showZkLogin: boolean; // Prop to receive zkLogin state from App.tsx
}

/**
 * GalleryPage Component: The main page for the ImmersivΞ gallery.
 *
 * This page combines several sections, including the Hero section, About section,
 * Slogans, Roadmap, and Footer.  It also conditionally renders the ZkLoginPage.
 */
function GalleryPage({ setPage, setShowZkLogin, showZkLogin }: GalleryPageProps) {
  const location = useLocation();

  useEffect(() => {
    console.log('GalleryPage showZkLogin updated:', showZkLogin);
    if (showZkLogin) {
      console.log('Opening ZkLoginPage');
    }
  }, [showZkLogin]);

  useEffect(() => {
     // Handle scrolling to the About section if navigated from another page.
    if (location.state?.scrollTo === 'about') {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Clean up any stray canvas or WebXR elements
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      if (canvas.parentElement === document.body) {
        document.body.removeChild(canvas);
      }
    });

    const arButtons = document.querySelectorAll('#ARButton');
    arButtons.forEach(button => {
      if (button.parentElement === document.body) {
        document.body.removeChild(button);
      }
    });
  }, [location]);

  return (
    <div>
      <Navbar
        isLanding={false}
        setPage={setPage}
        setShowZkLogin={setShowZkLogin}
      />
    <section className="mb-16"><Hero /></section>
    <section className="mb-16"><PortalPage /></section>
    <section className="mb-16"><About /></section>
    <section className="mb-16"><Slogans /></section>
    <section className="mb-0"><Roadmap /></section>
    <section className="mb-0"><FAQ /></section>
    <section><Footer /></section>
      {showZkLogin && <ZkLoginPage setShowZkLogin={setShowZkLogin} />}
    </div>
  );
}

export default GalleryPage;