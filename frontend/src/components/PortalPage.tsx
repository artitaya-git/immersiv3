import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PortalPage Component: A category page leading to an immersive VR portal experience.
 *
 * This component is part of the gallery page and serves as an entry point to the VR portal section.
 */
function PortalPage() {
    return (
        <section className="min-h-screen flex flex-col items-center text-center pt-20 pb-20">
            <div className="w-full max-w-4xl px-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 mt-16">
                    ImmersivΞ Portal
                </h2>
                <p className="text-sm sm:text-base lg:text-lg opacity-80 mb-10 md:mb-10">
                    Step into the Portal — Experience immersive dimensions in VR
                </p>
                <div className="flex justify-center mb-8">
                    <Link
                        to="/vr"
                        className="w-full max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px]
                                px-6 py-3 border-2 rounded-lg
                                text-lg font-medium text-center
                                border-[var(--text-color)] text-[var(--text-color)]
                                hover:bg-[var(--text-color)] hover:text-[var(--bg-color)]
                                transition-all duration-300 ease-in-out
                                transform hover:scale-[1.02] active:scale-[0.98]
                                hover:shadow-lg"
                    >
                        Enter Portal
                    </Link>
                </div>
                <div className="flex flex-col items-center justify-center w-full max-w-6xl px-4">
                    <div className="w-full flex justify-center">
                        <div className="flex flex-col items-center">
                            {/* === Portal Image === */}
                            <img
                                src="/media/portal.webp"
                                alt="Portal 360 View"
                                className="w-full max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px]
                                        h-auto aspect-[500/313] object-cover rounded-lg mb-5"
                            />
                        </div>
                    </div>
                </div>

                {/* === VR user manual === */}
                <div className="w-full max-w-md p-4 mx-auto mt-8 custom-lg:mt-0 custom-lg:absolute custom-lg:right-10 custom-lg:top-[188%] custom-xl:right-10 custom-xl:top-[157.5%]">    
                    <div className="bg-[var(--bg-color)] text-[var(--text-color)] rounded-lg shadow-xl border border-white/30 p-4">
                        <h3 className="text-lg font-semibold mb-2">Getting Started:</h3>
                        <ul className="list-none text-sm space-y-2 leading-relaxed">
                            <li>Enter digital spaces via this portal.</li>
                            <li>
                                Tap <span className="font-semibold">[Enter Portal]</span> to begin.
                            </li>
                            <li className="my-4">
                                <span className="text-lg font-semibold block mb-2">VR Mode:</span>
                                <ul className="list-none ml-4 space-y-1 leading-relaxed">
                                    <li>Tap <span className="font-semibold">[Enter VR]</span> inside.</li>
                                    <li>Use a VR headset or phone with Cardboard for full view.</li>
                                    <li>Without VR, a 360° view works on mobile and desktop.</li><br />
                                    <li><span className="font-semibold">NOTE: VR not supported on desktop.</span></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PortalPage;