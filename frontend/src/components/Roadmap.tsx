import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Component Roadmap: Draft project implementation plan
 */
function Roadmap() {
    const card1Ref = useRef(null);
    const card2Ref = useRef(null);
    const card3Ref = useRef(null);

    useEffect(() => {
        // Animation for each Card
        [card1Ref, card2Ref, card3Ref].forEach((ref) => {
        gsap.fromTo(
            ref.current,
            { y: 50, opacity: 0 },
            {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%', // Card top at 85% viewport height
                end: 'bottom 65%', // Card bottom at 65% viewport height
                scrub: 1, // Add scrub effect when scrolling
                toggleActions: 'play none none reverse', 
            },
            }
        );
        });
    }, []);

    return (
        <section className="pt-24 pb-16 mt-12 max-w-5xl mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">Our Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div ref={card1Ref} className="roadmap-card p-6 border border-[var(--text-color)] rounded-lg text-center">
            <h4 className="text-xl font-semibold mb-4">Phase 1: Early Adoption</h4>
            <div className="text-sm opacity-80">
                <ul className="list-disc list-inside leading-relaxed space-y-0.5">
                <li>Develop and deploy Kiosk smart contract</li>
                <li>Launch stable version of 3D NFTs Gallery</li>
                <li>Enable NFTs Minting</li>
                <li>Implement Multi-Format 3D Viewer</li>
                <li>Build Community (Discord & Socials)</li>
                </ul>
            </div>
            </div>
            <div ref={card2Ref} className="roadmap-card p-6 border border-[var(--text-color)] rounded-lg text-center">
            <h4 className="text-xl font-semibold mb-4">Phase 2: Creator Onboarding</h4>
            <div className="text-sm opacity-80">
                <ul className="list-disc list-inside leading-relaxed space-y-0.5">
                <li>Develop Creator Dashboard</li>
                <li>Launch Creator Profiles (Showcase)</li>
                <li>Partner with Sui Ecosystem</li>
                <li>Introduce Interactive 3D Spaces</li>
                <li>Launch Lite Marketplace for 3D NFTs and assets</li>
                <li>Integrate AI (Smart Search & Tagging)</li>
                </ul>
            </div>
            </div>
            <div ref={card3Ref} className="roadmap-card p-6 border border-[var(--text-color)] rounded-lg text-center">
            <h4 className="text-xl font-semibold mb-4">Phase 3: Monetization</h4>
            <div className="text-sm opacity-80">
                <ul className="list-disc list-inside leading-relaxed space-y-0.5">
                <li>Airdrop tokens to early supporters and creators</li>
                <li>Implement DAO Governance</li>
                <li>Launch Full Marketplace</li>
                <li>Use AI (Personalized Recommendations)</li>
                <li>Develop Advanced Creator Tools</li>
                <li>Grow XR Creator Ecosystem</li>
                </ul>
            </div>
            </div>
        </div>
        </section>
    );
}

export default Roadmap;