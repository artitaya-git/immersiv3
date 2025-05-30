import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Slogans Component: Displays the main slogans with animation.
 *
 * This component shows the main slogans of the website with a smooth animation
 * using GSAP and ScrollTrigger.
 */
function Slogans() {
    const sloganRef = useRef<HTMLDivElement>(null);
    const finalLineRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        // Animation for the main slogan phrases.
        if (sloganRef.current) {
        const phrases = sloganRef.current.querySelectorAll('.phrase-group');

        gsap.fromTo(
            phrases,
            { y: 50, opacity: 0, skewY: 5 }, // Start position and style
            {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 1.5,       // Animation duration
            ease: 'power4.out', // Easing function for smooth animation
            stagger: 0.9,        // Staggered animation for each phrase
            delay: 3.0,          // Delay before the animation starts
            scrollTrigger: {
                trigger: sloganRef.current, // Element that triggers the animation
                start: 'top 85%',       // Start animation when the top of the element is 85% in the viewport
                end: 'bottom 60%',     // End animation when the bottom of the element is 60% in the viewport
                toggleActions: 'play none none reverse', // Control animation when entering/leaving viewport
            },
            }
        );
        }

        // Animation for the final line of the slogan.
        if (finalLineRef.current) {
        gsap.fromTo(
            finalLineRef.current,
            { y: 50, opacity: 0 }, // Start position and style
            {
            y: 0,
            opacity: 1,
            duration: 1,          // Animation duration
            ease: 'power2.out',   // Easing function
            delay: 1.0,           // Delay before animation
            scrollTrigger: {
                trigger: finalLineRef.current, // Trigger element
                start: 'top 90%',       // Start when the top is 90% in viewport
                toggleActions: 'play none none reverse', // Control on enter/leave
            },
            }
        );
        }
    }, []); // Empty dependency array:  Effect runs only once on component mount

    return (
        <section className="flex flex-col items-center justify-center text-center px-6 py-12 pb-40 text-[var(--text-color)]">
        {/* Container for the main slogan */}
        <div ref={sloganRef}>
            <p className="text-4xl md:text-5xl font-bold leading-snug max-w-7xl mx-auto px-4 whitespace-pre-wrap">
            <span className="phrase-group inline-block mr-4">We dream,</span>
            <span className="phrase-group inline-block mr-4">we create,</span>
            <span className="phrase-group inline-block">we explore</span>
            </p>
            {/* The final line of the slogan */}
            <p
            ref={finalLineRef}
            className="block text-4xl md:text-5xl font-bold mt-4"
            >
            — crafting new worlds in XR
            </p>
        </div>
        </section>
    );
}

export default Slogans;
