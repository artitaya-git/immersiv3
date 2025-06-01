import React from 'react';

interface MintedSuccessModalProps {
    show: boolean;
    onClose: () => void;
}

/**
 * MintedSuccessModal Component: Displays confirmation after successful NFT minting as a modal.
 *
 */
function MintedSuccessModal({ show, onClose }: MintedSuccessModalProps) {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative bg-[#000000] text-[#f1f1f1] border border-[#f1f1f1]/20 
            rounded-lg shadow-2xl w-full max-w-md p-8 text-center">
                
                {/* Top Accent Line */}
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#f1f1f1]/40 to-transparent mx-auto mb-6"></div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-4">Minted Successfully!</h3>
                <p className="mb-6 opacity-80">
                    Congratulations! Your NFT has been minted and added to your wallet!
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-3 px-4 text-[#f1f1f1] hover:text-[#000000] hover:bg-[#f1f1f1] transition-all 
                    duration-300 rounded border border-[#f1f1f1]/20 hover:border-[#f1f1f1]"
                >
                    ← Back to Gallery
                </button>

                {/* Bottom Accent Line */}
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#f1f1f1]/40 to-transparent mx-auto mt-6"></div>
            </div>
        </div>
    );
}

export default MintedSuccessModal;