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

  // === Enhanced Mobile Protection + AR Icon Fixed ===
  useEffect(() => {
    // Prevent horizontal scroll
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    // Prevent mobile bounce effects
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    // Prevent unwanted touch behaviors (iOS) - && keep AR interaction
    (document.body.style as any).webkitUserSelect = 'none';
    (document.body.style as any).webkitTouchCallout = 'none';
    (document.body.style as any).webkitTapHighlightColor = 'transparent';

    // AR viewport configuration
    const handleOrientationChange = () => {
      setTimeout(() => {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
          viewport = document.createElement('meta');
          viewport.setAttribute('name', 'viewport');
          document.head.appendChild(viewport);
        }
        
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=auto'
        );
        
        // Force layout recalculation
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };

    // Initial viewport setup
    handleOrientationChange();

    window.addEventListener('orientationchange', handleOrientationChange);

    // Selective touch prevention (avoid blocking AR interactions)
    const handleTouchMove = (e: TouchEvent) => {
      // Check if touch is on model-viewer or AR elements
      const target = e.target as HTMLElement;
      const isARElement = target.closest('model-viewer') || 
                          target.closest('[slot="ar-button"]') ||
                          target.closest('#ar-button') ||
                          target.id === 'ar-button';
      
      if (isARElement) {
        return;
      }
      
      // Prevent pinch-to-zoom (multi-touch) outside AR
      if (e.touches.length > 1) {
        e.preventDefault();
        return;
      }
      
      // Prevent horizontal swipes near edges (not AR areas)
      const touch = e.touches[0];
      const edgeThreshold = window.innerWidth * 0.05;
      
      if (touch.clientX < edgeThreshold || touch.clientX > window.innerWidth - edgeThreshold) {
        e.preventDefault();
      }
    };

    // Selective double-tap prevention
    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const isARElement = target.closest('model-viewer') || 
                          target.closest('[slot="ar-button"]') ||
                          target.closest('#ar-button') ||
                          target.id === 'ar-button';
      
      // Don't prevent double-tap on AR elements
      if (isARElement) {
        return;
      }
      
      const now = Date.now();
      const timeSince = now - (window as any).lastTouchEnd;
      
      if (timeSince < 300 && timeSince > 0) {
        e.preventDefault();
      }
      
      (window as any).lastTouchEnd = now;
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Ensure AR buttons are always visible
    const ensureARButtonVisibility = () => {
      const arButtons = document.querySelectorAll('#ar-button');
      arButtons.forEach(button => {
        const htmlButton = button as HTMLElement;
        if (htmlButton) {
          // Force AR button to be within viewport
          htmlButton.style.position = 'absolute';
          htmlButton.style.zIndex = '1000';
          
          // Check if button is outside viewport
          const rect = htmlButton.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          if (rect.top < 0 || rect.bottom > viewportHeight) {
            // Adjust button position
            htmlButton.style.bottom = '20px';
            htmlButton.style.top = 'auto';
          }
        }
      });
    };
    const visibilityInterval = setInterval(ensureARButtonVisibility, 1000);

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
      clearInterval(visibilityInterval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen overflow-x-hidden"
      style={{
        overscrollBehavior: 'none',
        WebkitOverflowScrolling: 'touch',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
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