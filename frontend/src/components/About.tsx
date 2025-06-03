import React, { useRef } from 'react';

/**
 * About Component: Displays the "About Us" section of the website.
 *
 */
function About() {
  return (
    <section
      id="about-section"
      className="pt-36 pb-24 text-center text-[var(--text-color)] px-4"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 mt-16">
        About ImmersivΞ
        </h2>

      <div className="text-lg opacity-80 leading-relaxed max-w-2xl mx-auto text-pretty">
        <p>
          ImmersivΞ is building a next-generation platform empowering creators to design, 
          share, and monetize interactive XR experiences for a diverse audience, 
          from digital art and cultural exploration to branded activations.
        </p>
        <p className="mt-8">
          We began with a 3D NFT gallery on the Sui Blockchain on testnet — offering 1111 early edition 
          digital pieces with AR features during the Sui Overflow 2025 hackathon — as an early exploration 
          of digital ownership and immersive presentation.
        </p>
      </div>
    </section>

  );
}

export default About;