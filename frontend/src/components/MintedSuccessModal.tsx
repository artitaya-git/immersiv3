// MintedSuccessModal.tsx
import React from 'react';

interface MintedSuccessModalProps {
    show: boolean;
    onClose: () => void;
}

/**
 * MintedSuccessModal Component: Displays confirmation after successful NFT minting as a modal.
 *
 * This component shows a confirmation message to the user after they have successfully
 * minted an NFT. It provides a visual confirmation and a button to close the modal.
 */
function MintedSuccessModal({ show, onClose }: MintedSuccessModalProps) {
    if (!show) {
        return null;
    }

    return (        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="relative bg-[var(--bg-color)] text-[var(--text-color)] border border-white/20 rounded-lg shadow-2xl w-full max-w-md p-8 text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-4">Minted Successfully!</h3>
                <p className="mb-6 opacity-80">
                    Congratulations! Your NFT has been minted and added to your wallet!
                </p>
                <button
                    onClick={onClose}
                    className="connect-btn px-4 py-2 border border-[var(--text-color)] rounded-md text-lg hover:bg-[var(--text-color)] hover:text-[var(--bg-color)]"
                >
                    ← Back to Gallery
                </button>
            </div>
        </div>
    );
}

export default MintedSuccessModal;