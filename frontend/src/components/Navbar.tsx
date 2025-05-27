import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

interface NavbarProps {
    isLanding: boolean;
    setPage: (page: 'landing' | 'gallery' | 'minted') => void;
    setShowZkLogin: (show: boolean) => void;
    }

/**
 * Navbar Component:  The navigation bar for the application.
 *
 * This component displays the navigation links, theme toggle, and wallet connection
 * functionality.  It adapts its appearance based on whether it's being displayed
 * on the landing page or a sub-page.
 */
function Navbar({ isLanding, setPage, setShowZkLogin }: NavbarProps) {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Use the hook from @mysten/dapp-kit to get the address
    const account = useCurrentAccount();
    const address = account?.address;

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const toggleMute = () => {
        if (audioRef.current) {
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
        }
    };

    useEffect(() => {
        if (isLanding) {
        document.documentElement.classList.add('dark');
        }
    }, [isLanding]);

    const handleLogoClick = () => {
        setPage('landing'); // Sync state with Landing
        navigate('/'); // Change to Landing
    };

    return (
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
        <div className="flex items-center space-x-4">
            {isLanding ? (
            <>
                <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-white/10 transition-all"
                >
                {isMuted ? '🔇' : '🔊'}
                </button>

                <Link
                to="/gallery"
                state={{ scrollTo: 'about' }}
                className="text-[#f1f1f1] hover:text-[#b2b2b2]"
                >
                    About
                </Link>

            </>
            ) : (
            <>
                <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all"
                >
                {isDark ? '☀️' : '🌙'}
                </button>

                {/* === Wallet Connect Button === */}
                    <ConnectButton
                            connectText="Connect Wallet"
                            className="wallet-connect-btn text-xs sm:text-sm font-medium min-w-[80px] max-w-[120px] sm:min-w-[120px] sm:max-w-[160px] truncate"
                        />

                        {/* === Show Address if Connected === */}
                        {address && (
                            <span className="text-[0.75rem] sm:text-xs truncate max-w-[100px] sm:max-w-[140px]">
                                {address.slice(0, 6)}...{address.slice(-4)}
                            </span>
                        )}

                {/* === ZkLogin === */}
                {/* <button
                onClick={() => {
                    console.log('Clicked Google Login, calling setShowZkLogin(true)');
                    setShowZkLogin(true);
                }}
                            
                className="connect-btn px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm 
                lg:px-4 lg:py-2 lg:text-base border border-[var(--text-color)] rounded-md 
                hover:bg-[var(--text-color)] hover:text-[var(--bg-color)]"
                >
                Google Login
                </button> */}

            </>
            )}
        </div>

        {/* === Audio === */}
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
    );
}

export default Navbar;