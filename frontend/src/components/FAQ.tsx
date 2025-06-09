import React from 'react';
import { HiChevronDown } from 'react-icons/hi';

/**
 * FAQ Component: Displays Frequently Asked Questions with an accordion-style toggle.
 *
 */
function FAQ() {
    return (
        <section className="pt-24 pb-16 mx-auto px-4">
            <h3 className="text-3xl font-bold mb-8 text-center text-[var(--text-color)]">Frequently Asked Questions (FAQ)</h3>
            <div className="max-w-lg md:max-w-2xl mx-auto space-y-4 faq-container text-left"> 
                <details className="bg-[var(--bg-color)] border border-white/30 rounded-lg shadow-lg">
                    <summary className="p-4 text-[var(--text-color)] font-semibold cursor-pointer flex justify-between items-center text-left">
                        <span>Do I need to download an app to view AR/VR content?</span>
                        <HiChevronDown className="ml-2 text-[var(--text-color)] text-sm flex-shrink-0" />
                    </summary>
                    <p className="p-4 text-sm text-[var(--text-color)] opacity-80 text-left">
                        No, you don't! Simply open <span className="font-semibold">immersiv3.tech</span> on your 
                        WebXR-compatible mobile device or browser, and you can view the content instantly.
                    </p>
                </details>
                <details className="bg-[var(--bg-color)] border border-white/30 rounded-lg shadow-lg">
                    <summary className="p-4 text-[var(--text-color)] font-semibold cursor-pointer flex justify-between items-center text-left">
                        <span>Do I need VR or AR glasses to use this?</span>
                        <HiChevronDown className="ml-2 text-[var(--text-color)] text-sm flex-shrink-0" />
                    </summary>
                    <p className="p-4 text-sm text-[var(--text-color)] opacity-80 text-left">
                        Not at all! You can immediately use any <span className="font-semibold">AR-supported mobile phone</span> or <span className="font-semibold">tablet</span> to experience the content.
                    </p>
                </details>
                <details className="bg-[var(--bg-color)] border border-white/30 rounded-lg shadow-lg">
                    <summary className="p-4 text-[var(--text-color)] font-semibold cursor-pointer flex justify-between items-center text-left">
                        <span>Is what I see in AR already an NFT?</span>
                        <HiChevronDown className="ml-2 text-[var(--text-color)] text-sm flex-shrink-0" />
                    </summary>
                    <p className="p-4 text-sm text-[var(--text-color)] opacity-80 text-left">
                        Not yet. Those are currently sample files for you to experience in AR before you decide to mint them as actual NFTs.
                    </p>
                </details>
                <details className="bg-[var(--bg-color)] border border-white/30 rounded-lg shadow-lg">
                    <summary className="p-4 text-[var(--text-color)] font-semibold cursor-pointer flex justify-between items-center text-left">
                        <span>Can I mint an NFT right now?</span>
                        <HiChevronDown className="ml-2 text-[var(--text-color)] text-sm flex-shrink-0" />
                    </summary>
                    <p className="p-4 text-sm text-[var(--text-color)] opacity-80 text-left">
                        Yes, you can! However, the system is still in its <span className="font-semibold">testnet phase.</span> You can <span className="font-semibold">mint for free</span> to try out the features before we officially launch on the mainnet.
                    </p>
                </details>
                <details className="bg-[var(--bg-color)] border border-white/30 rounded-lg shadow-lg">
                    <summary className="p-4 text-[var(--text-color)] font-semibold cursor-pointer flex justify-between items-center text-left">
                        <span>Do I need a Sui Wallet?</span>
                        <HiChevronDown className="ml-2 text-[var(--text-color)] text-sm flex-shrink-0" />
                    </summary>
                    <p className="p-4 text-sm text-[var(--text-color)] opacity-80 text-left">
                        You'll need to connect a <span className="font-semibold">Sui Wallet</span> if you wish to mint or collect NFTs. However, you can start exploring and enjoying the content right away, even without a wallet connection.
                    </p>
                </details>
                <details className="bg-[var(--bg-color)] border border-white/30 rounded-lg shadow-lg">
                    <summary className="p-4 text-[var(--text-color)] font-semibold cursor-pointer flex justify-between items-center text-left">
                        <span>What is Sui blockchain?</span>
                        <HiChevronDown className="ml-2 text-[var(--text-color)] text-sm flex-shrink-0" />
                    </summary>
                    <p className="p-4 text-sm text-[var(--text-color)] opacity-80 text-left">
                        Sui is a new, high-performance Layer 1 blockchain designed for secure, fast transactions, low fees, and suitability for interactive applications like 3D NFTs or AR/VR content.
                    </p>
                </details>
            </div>
        </section>
    );
}

export default FAQ;