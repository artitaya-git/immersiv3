import React, { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * LandingPage Component: The initial page the user sees when entering the application.
 *
 */

function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null); 
  const logoRef = useRef<HTMLHeadingElement>(null); 
  const slogan1Ref = useRef<HTMLParagraphElement>(null); 
  const scrollRef = useRef<HTMLParagraphElement>(null); 
  const enterButtonRef = useRef<HTMLButtonElement>(null); 
  const containerRef = useRef<HTMLDivElement>(null);  
  const navigate = useNavigate();
  const isScrolling = useRef(false);
  
  // Touch event tracking
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  useEffect(() => {
    // === GSAP Animations ===
    gsap.fromTo(
      videoRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' }
    );

    gsap.fromTo(
      logoRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
    );

    if (slogan1Ref.current) {
      gsap.fromTo(
        slogan1Ref.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          delay: 0.8,
        }
      );
    }

    gsap.fromTo(
      scrollRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 1.5,
        ease: 'power2.out',
        repeat: -1,
        yoyo: true,
      }
    );

    gsap.fromTo(
      enterButtonRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 1 }
    );

    // === Animation function ===
    const triggerTransition = () => {
      if (isScrolling.current) return;
      
      isScrolling.current = true;
      
      // Create smooth animation timeline
      const tl = gsap.timeline({
        onComplete: () => navigate('/gallery') 
      });

      // Fade out elements
      tl.to([logoRef.current, slogan1Ref.current, enterButtonRef.current, scrollRef.current], {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: 'power2.in',
        stagger: 0.1 
      })
      .to(videoRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in'
      }, 0) // Start at the beginning of the timeline (0)
      .to(containerRef.current, {
        backgroundColor: '#000000', 
        duration: 0.8,
        ease: 'power2.in'
      }, 0); 
    };

    // === Desktop scroll handler ===
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) { // Check if scroll down
        e.preventDefault();
        triggerTransition();
      }
    };

    // === Mobile touch handlers ===
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default scrolling behavior
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      const deltaY = touchStartY.current - touchEndY;
      const deltaTime = touchEndTime - touchStartTime.current;
      
    // Detect quick upward swipe (scroll down)
    // deltaY > 50: Upward swipe (scroll down)
    // deltaTime < 300: Quick gesture
      if (deltaY > 50 && deltaTime < 300) {
        triggerTransition();
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate]);
  
  return (

    // === Video background ===
    <section 
      ref={containerRef}
      className="relative w-full h-screen landing-section overflow-hidden"
    >    
      <video
        ref={videoRef}
        src="/media/immersiv3.mp4"
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      {/* === Overlay Content === */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-6 md:pt-16 text-[#f1f1f1]">  
          <h1 ref={logoRef} className="text-3xl md:text-6xl lg:text-7xl font-bold mb-2">
                    ImmersivΞ
                </h1>
                <p
                    ref={slogan1Ref}
                    className="text-base md:text-3xl lg:text-4xl font-semibold leading-snug max-w-5xl 
                    mx-auto px-4 whitespace-pre-wrap text-[#b2b2b2]"
                >
                    <span className="block">Where imagination shapes reality</span>
                    <span className="block">— in 3D, AR, and beyond</span>
                </p>
                
        <button
          ref={enterButtonRef}
          onClick={() => {

            if (isScrolling.current) return;
            isScrolling.current = true;
            
            const tl = gsap.timeline({
              onComplete: () => navigate('/gallery')
            });

            tl.to([logoRef.current, slogan1Ref.current, enterButtonRef.current, scrollRef.current], {
              opacity: 0,
              y: -50,
              duration: 0.8,
              ease: 'power2.in',
              stagger: 0.1
            })
            .to(videoRef.current, {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.in'
            }, 0)
            .to(containerRef.current, {
              backgroundColor: '#000',
              duration: 0.8,
              ease: 'power2.in'
            }, 0);
          }}
          
          className="connect-btn px-3 py-1.5 text-sm md:px-6 md:py-3 md:text-lg border border-[#b2b2b2] 
          text-[#b2b2b2] rounded-md hover:bg-[#b2b2b2] hover:text-black mt-8"
        >
          Enter the Gallery
        </button>

        <p ref={scrollRef} className="absolute bottom-8 text-sm opacity-70">
          Scroll Down ↓
        </p>
      </div>

      <Navbar isLanding={true} />
    </section>
  );
}

export default LandingPage;