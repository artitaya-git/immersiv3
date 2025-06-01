import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import PortalPage from './PortalPage';
import About from './About';
import Slogans from './Slogans';
import Roadmap from './Roadmap';
import FAQ from './FAQ';
import Footer from './Footer';
import Navbar from './Navbar';


/**
 * GalleryPage Component: The main page for the ImmersivΞ gallery.
 */
function GalleryPage() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle scrolling to specific sections
    const scrollToSection = location.state?.scrollTo;
    if (scrollToSection) {
      setTimeout(() => {
        let targetElement;
        
        switch (scrollToSection) {
          case 'about':
            targetElement = document.getElementById('about-section');
            break;
          case 'roadmap':
            targetElement = document.getElementById('roadmap-section');
            break;
          case 'faq':
            targetElement = document.getElementById('faq-section');
            break;
        }
        
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
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

  // === Essential Mobile Protection + Orientation Fix ===
  useEffect(() => {
    // Prevent horizontal scroll
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    // Prevent mobile bounce effects
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    // Prevent unwanted touch behaviors (iOS)
    (document.body.style as any).webkitUserSelect = 'none';
    (document.body.style as any).webkitTouchCallout = 'none';
    (document.body.style as any).webkitTapHighlightColor = 'transparent';

    // Fix orientation change scaling
    const handleOrientationChange = () => {
      setTimeout(() => {

        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
          viewport = document.createElement('meta');
          viewport.setAttribute('name', 'viewport');
          document.head.appendChild(viewport);
        }
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
        
        // Force layout recalculation
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    // Prevent pinch-to-zoom and horizontal swipes
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent pinch-to-zoom (multi-touch)
      if (e.touches.length > 1) {
        e.preventDefault();
        return;
      }
      
      // Prevent horizontal swipes near edges
      const touch = e.touches[0];
      const edgeThreshold = window.innerWidth * 0.05;
      
      if (touch.clientX < edgeThreshold || touch.clientX > window.innerWidth - edgeThreshold) {
        e.preventDefault();
      }
    };

    // Prevent double-tap zoom
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      const timeSince = now - (window as any).lastTouchEnd;
      
      if (timeSince < 300 && timeSince > 0) {
        e.preventDefault();
      }
      
      (window as any).lastTouchEnd = now;
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Cleanup
    return () => {
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
      (document.body.style as any).webkitUserSelect = '';
      (document.body.style as any).webkitTouchCallout = '';
      (document.body.style as any).webkitTapHighlightColor = '';
      
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen overflow-x-hidden"
      style={{
        overscrollBehavior: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <Navbar
        isLanding={false}
      />
      
      {/* Main content with stable container */}
      <div className="w-full overflow-x-hidden"> 
        <section className="mb-16 w-full"><Hero /></section>
        <section className="mb-16 w-full"><PortalPage /></section>
        <section className="mb-16 w-full" id="about-section"><About /></section>
        <section className="mb-16 w-full"><Slogans /></section>
        <section className="mb-0 w-full" id="roadmap-section"><Roadmap /></section>
        <section className="mb-0 w-full" id="faq-section"><FAQ /></section>
        <section className="w-full"><Footer /></section>
      </div>
    </div>
  );
}

export default GalleryPage;