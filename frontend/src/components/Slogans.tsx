import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Slogans Component: Displays the main slogans with smooth animations.
 */
function Slogans() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sloganRef = useRef<HTMLDivElement>(null);
    const finalLineRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // === Initial Setup GSAP ===
            gsap.set('.phrase-group', { 
                opacity: 0, 
                y: 50, 
                skewY: 5
            });
            gsap.set(finalLineRef.current, { 
                opacity: 0, 
                y: 50
            });
            gsap.set('.tech-border', { 
                scaleX: 0,
                transformOrigin: 'center center'
            });

            // === Main Timeline ===
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',       
                    end: 'bottom 60%',      
                    toggleActions: 'play none none reverse',
                }
            });

            // 1: Border Animation
            tl.to('.tech-border', {
                scaleX: 1,
                duration: 1.2,
                ease: 'power2.out'
            })

            // Phase 2 
            .to('.phrase-group', {
                y: 0,
                opacity: 1,
                skewY: 0,
                duration: 1.5,       
                ease: 'power4.out',  
                stagger: 0.9,       
                delay: 1.0           
            }, 0.3)

            // Final Line 
            .to(finalLineRef.current, {
                y: 0,
                opacity: 1,
                duration: 1,          
                ease: 'power2.out',   
                delay: 1.0            
            }, 4.5);

            // Hover Effects 
            const phrases = document.querySelectorAll('.phrase-group');
            phrases.forEach((phrase) => {
                const element = phrase as HTMLElement;
                
                element.addEventListener('mouseenter', () => {
                    gsap.to(element, {
                        scale: 1.02,
                        color: '#3b82f6',
                        textShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                });

                element.addEventListener('mouseleave', () => {
                    gsap.to(element, {
                        scale: 1,
                        color: 'var(--text-color)',
                        textShadow: 'none',
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                });
            });

            // Final Line Hover Effect 
            if (finalLineRef.current) {
                finalLineRef.current.addEventListener('mouseenter', () => {
                    gsap.to(finalLineRef.current, {
                        scale: 1.01,
                        textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                });

                finalLineRef.current.addEventListener('mouseleave', () => {
                    gsap.to(finalLineRef.current, {
                        scale: 1,
                        textShadow: 'none',
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                });
            }

        }, containerRef);

        return () => ctx.revert(); // Cleanup
    }, []);

    return (
        <section 
            ref={containerRef}
            className="relative flex flex-col items-center justify-center text-center px-6 py-12 pb-40 text-[var(--text-color)] overflow-hidden"
        >
            {/* Neon Horizontal Accent Lines */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="tech-border absolute top-[2%] left-1/2 transform -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"></div>
                <div className="tech-border absolute bottom-[20%] left-1/2 transform -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"></div>
            </div>

            {/* Container for the main slogan */}
            <div ref={sloganRef} className="relative z-10">
                <p className="text-4xl md:text-5xl lg:text-6xl font-bold leading-snug max-w-7xl mx-auto px-4 whitespace-pre-wrap">
                    <span className="phrase-group inline-block mr-4">We dream,</span>
                    <span className="phrase-group inline-block mr-4">we create,</span>
                    <span className="phrase-group inline-block">we explore</span>
                </p>

                {/* The final line of the slogan */}
                <p
                    ref={finalLineRef}
                    className="block text-3xl md:text-4xl lg:text-5xl font-bold mt-4"
                    style={{
                        backgroundImage: 'linear-gradient(45deg, var(--text-color), #3b82f6)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent'
                    }}
                >
                    — crafting new worlds in XR
                </p>
            </div>
        </section>
    );
}

export default Slogans;