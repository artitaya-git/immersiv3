import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { FaSun, FaMoon, FaVolumeMute, FaVolumeUp, FaTimes } from 'react-icons/fa';

interface NavbarProps {
    isLanding: boolean;
}

/**
 * Navbar Component:  The navigation bar for the application.
 *
 * This component displays the navigation links, theme toggle, and wallet connection functionality.  
 */
function Navbar({ isLanding }: NavbarProps) {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Use the hook from @mysten/dapp-kit to get the address
    const account = useCurrentAccount();
    const address = account?.address;

    const toggleMute = () => {
        if (audioRef.current) {
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
        }
    };
    
    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleMenuItemClick = (path: string, section?: string) => {
        setShowMenu(false);
        if (section) {
            navigate(path, { state: { scrollTo: section } });
        } else {
            navigate(path);
        }
    };

    useEffect(() => {
        if (isLanding) {
        document.documentElement.classList.add('dark');
        }
    }, [isLanding]);

    const handleLogoClick = () => {
        navigate('/'); // Change to Landing
    };

    return (
        <>
        {/* Logo */}
        <nav
        className={`flex justify-between items-center w-full top-0 z-50 px-4 py-2 ${
            isLanding
            ? 'absolute text-[#f1f1f1] bg-transparent'
            : 'fixed bg-[var(--bg-color)] text-[var(--text-color)] border-b border-[var(--text-color)] border-opacity-30'
        }`}
        >
        <h1 onClick={handleLogoClick} className="text-lg font-bold cursor-pointer">
            ImmersivΞ
        </h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
            {isLanding ? (
            <>
                {/* Icon - Audio On/Off */}
                <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-white/10 transition-all"
                >
                {isMuted ? <FaVolumeMute className="w-5 h-5 social-icon" /> : <FaVolumeUp className="w-5 h-5 social-icon" />}
                </button>

                {/* Menu Button */}
                <button
                onClick={toggleMenu}
                className="text-[#f1f1f1] hover:text-[#b2b2b2] text-[22px] md:text-[26px] font-semibold transition-all duration-300 hover:scale-110"
                >
                    Ξ
                </button>
            </>
            ) : (
            <>
                {/* Icon - Background dark/light */}
                <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all"
                >                
                {isDark ? <FaSun className="w-5 h-5 social-icon" /> : <FaMoon className="w-5 h-5 social-icon" />}
                </button>

                {/* === Wallet Connect Button === */}
                <ConnectButton
                className="wallet-connect-btn bg-[#F1F1F1] text-[#000000] px-2 py-1 text-[12px] sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm lg:text-base min-w-[100px] max-w-[120px] sm:max-w-[140px] md:max-w-[168px] lg:max-w-[189px] whitespace-nowrap border-2 shadow-sm hover:shadow-lg hover:scale-104 active:scale-95"
                connectText="Connect Wallet"
                />
                {address && (
                    <span className="text-[10px] sm:text-xs max-w-[80px] sm:max-w-[100px] truncate ml-1">
                    {address.slice(0, 4)}...{address.slice(-3)}
                </span>
                )}

                {/* Menu Button - Gallery Page */}
                <button
                onClick={toggleMenu}
                className="text-[var(--text-color)] hover:text-[var(--bg-color)] hover:bg-[var(--text-color)] p-2 rounded-full text-[22px] md:text-[26px] font-semibold transition-all duration-300"
                >
                    Ξ
                </button>

            </>
            )}
        </div>

        {/* === Load Audio === */}
        {isLanding && (
            <audio
            ref={audioRef}
            src="/media/immersiv3-audio.mp3"
            autoPlay
            loop
            muted
            onCanPlay={() => {
                if (audioRef.current) {
                audioRef.current.volume = 0.2;
                }
            }}
            />
        )}
        </nav>

        {/* Menu Overlay */}
        {showMenu && (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm">
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#000000] 
                border border-[#f1f1f1]/20 rounded-lg p-8 min-w-[320px] max-w-[400px] shadow-2xl">
                    {/* Close Button */}
                    <button
                        onClick={toggleMenu}
                        className="absolute top-4 right-4 text-[#f1f1f1] hover:text-[#b2b2b2] transition-all duration-300 hover:scale-110"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>

                    {/* Menu Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#f1f1f1] mb-2">ImmersivΞ</h2>
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#f1f1f1]/40 to-transparent mx-auto"></div>
                    </div>

                    {/* Menu Items */}
                    <nav className="space-y-4">
                        <button
                            onClick={() => handleMenuItemClick('/gallery')}
                            className="w-full text-center py-3 px-4 text-[#f1f1f1] hover:text-[#000000] hover:bg-[#f1f1f1] 
                            transition-all duration-300 rounded border border-[#f1f1f1]/20 hover:border-[#f1f1f1]"
                        >
                            XR Gallery
                        </button>
                        
                        <button
                            onClick={() => handleMenuItemClick('/gallery', 'about')}
                            className="w-full text-center py-3 px-4 text-[#f1f1f1] hover:text-[#000000] hover:bg-[#f1f1f1] 
                            transition-all duration-300 rounded border border-[#f1f1f1]/20 hover:border-[#f1f1f1]"
                        >
                            About Us
                        </button>
                        
                        <button
                            onClick={() => handleMenuItemClick('/gallery', 'roadmap')}
                            className="w-full text-center py-3 px-4 text-[#f1f1f1] hover:text-[#000000] hover:bg-[#f1f1f1] 
                            transition-all duration-300 rounded border border-[#f1f1f1]/20 hover:border-[#f1f1f1]"
                        >
                            Roadmap
                        </button>
                        
                        <button
                            onClick={() => handleMenuItemClick('/gallery', 'faq')}
                            className="w-full text-center py-3 px-4 text-[#f1f1f1] hover:text-[#000000] hover:bg-[#f1f1f1] 
                            transition-all duration-300 rounded border border-[#f1f1f1]/20 hover:border-[#f1f1f1]"
                        >
                            FAQ
                        </button>
                    </nav>

                    {/* Bottom Accent Line */}
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#f1f1f1]/40 to-transparent mx-auto mt-8"></div>
                </div>
            </div>
        )}
        </>
    );
}

export default Navbar;