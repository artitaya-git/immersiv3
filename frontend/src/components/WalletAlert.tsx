import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface WalletAlertProps {
    show: boolean;
    onClose: () => void;
    onConnectWallet?: () => void;
}

/**
 * WalletAlert Component: Alerts users to connect wallet before minting.
 */
function WalletAlert({ show, onClose, onConnectWallet }: WalletAlertProps) {
    if (!show) {
        return null;
    }

    const handleConnectClick = () => {
        onClose();
        if (onConnectWallet) {
            onConnectWallet();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm">
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#000000] 
            border border-[#f1f1f1]/20 rounded-lg p-8 min-w-[320px] max-w-[400px] shadow-2xl">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#f1f1f1] hover:text-[#b2b2b2] transition-all duration-300 hover:scale-110"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                {/* Top Accent Line */}
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#f1f1f1]/40 to-transparent mx-auto mb-6"></div>
                
                {/* Modal Title */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-[#f1f1f1] mb-2">Wallet Required</h2>
                    <p className="text-sm text-[#f1f1f1] opacity-80">
                        Please connect your wallet to mint NFTs
                    </p>
                </div>

                {/* Action Buttons */}
                <nav className="space-y-3">
                    <button
                        onClick={handleConnectClick}
                        className="w-full text-center py-3 px-4 text-[#f1f1f1] hover:text-[#000000] hover:bg-[#f1f1f1] transition-all duration-300 rounded border border-[#f1f1f1]/20 hover:border-[#f1f1f1]"
                    >
                        Connect Wallet
                    </button>
                    
                    <button
                        onClick={onClose}
                        className="w-full text-center py-2 px-4 text-[#f1f1f1] opacity-60 hover:opacity-100 transition-all duration-300"
                    >
                        Cancel
                    </button>
                </nav>

                {/* Bottom Accent Line */}
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#f1f1f1]/40 to-transparent mx-auto mt-6"></div>
            </div>
        </div>
    );
}

export default WalletAlert;