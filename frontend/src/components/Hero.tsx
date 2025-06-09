import { useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import MintedSuccessModal from './MintedSuccessModal';
import WalletAlert from './WalletAlert';
import { MdViewInAr } from 'react-icons/md';

const PACKAGE_ID = `0xfba51e0bfb4e9359927b100415fdb9af59303b681e968698415c63c152e06d41`;
const MINT_STATE_ID = `0x5b0d437f86e0a6a2340dc52f9f3b7e2db83ddba9058b7cded95f36eabec207d0`;

interface MintStateFields {
    minted: number; 
}
interface MoveObjectContent {
    dataType: 'moveObject';
    fields: MintStateFields;
    }
    function NumberMinted() {
    const { data, isLoading, isSuccess } = useSuiClientQuery(
        'getObject',
        {
        id: MINT_STATE_ID,
        options: {
            showContent: true,
        },
        }
    );
    const content = data?.data?.content as MoveObjectContent | undefined;

    return (
        <span className="mt-4 text-sm font-light mb-4">    
            {isLoading
                ? 'Loading...'
                : isSuccess && data.data?.content?.dataType === "moveObject"
                    ? `${(data.data.content.fields as { minted: string }).minted} / 1111 Minted`
                    : 'something wrong'}
        </span>
        )
}

/**
 * Hero Component: Displays the main landing section of the application.
 *
 * This component showcases the primary call to action for the user,
 * and a way to get started (e.g., minting an NFT, AR mode).
 */
function Hero() {
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const navigate = useNavigate();
    const account = useCurrentAccount(); 

    const [isMinting, setIsMinting] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showMintSuccessModal, setShowMintSuccessModal] = useState(false);
    const [showWalletAlert, setShowWalletAlert] = useState(false);

    const detectDevice = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        return {
            isIOS: /iphone|ipad|ipod/.test(userAgent),
            isAndroid: /android/.test(userAgent),
            isMobile: /mobile|tablet|ipad|iphone|android/.test(userAgent)
        };
    };
    const device = detectDevice(); 

    const nftMetadata = {
        name: "Immersiv3 Overflow 2025",
        description: "A 3D NFT artwork with AR experience.",
        image_url: "https://immersiv3.tech/nft-assets/thumbnail.webp", 
        model_url: "https://immersiv3.tech/nft-assets/nft.glb", 
        file_size: "9.7 MB",
        creator: "ImmersivΞ",
        artist: "Artitaya",
        copyright: "© 2025 ImmersivΞ",
        license: "CC BY-NC 4.0",
        keywords: ["3d art", "ar", "abstract", "particle wave"],
        category: "art",
        style: "abstract",
        use_case: "ar experience",
        technical_details: {
            format: "GLB",
            meshes: 2,
            vertices: 161113,
            faces: 256610,
            materials: "PBR (Vertex Colors)",
            rendered_in: "Three.js"
        },
        attributes: [
            { trait_type: "Edition", value: "Prototype" },
            { trait_type: "Wave Form", "value": "Static" }
        ]
    };

    const handleMint = () => {
        if (!account?.address) {
            setShowWalletAlert(true);
            return;
        }

        console.log('Initiate NFT Mint on Sui Blockchain');
        const tx = new Transaction();
        tx.moveCall({
            package: PACKAGE_ID,
            module: 'nft_minter_v2',
            function: 'mint_to_sender',
            arguments: [
                tx.object(MINT_STATE_ID), // shared object
                tx.pure.string(nftMetadata.name),       // name 
                tx.pure.string(nftMetadata.description), // description
                tx.pure.string(nftMetadata.image_url),   // image_url (thumbnail)
                tx.pure.string(nftMetadata.model_url),   // model_url (GLB file)           
            ]
        });
        signAndExecute({
            transaction: tx,
        }, {
            onSuccess: () => {
                console.log('Minting transaction successful!');
                setShowMintSuccessModal(true);
            },
            // onError callback 
            onError: (error) => {
                console.error('Minting transaction failed:', error);          
                let message = 'Transaction failed. Please try again.';
                if (error.message.includes('Insufficient gas')) { 
                    message = 'Insufficient gas. Please top up your SUI balance.';
                } else if (error.message.includes('UserRejected')) {
                    message = 'Transaction rejected by user.';
                } else if (error.message.includes('gas budget exceeded')) {
                    message = 'Gas budget exceeded. Consider increasing the gas budget.';
                } else {
                    message = `Error: ${error.message}`;
                }

                setErrorMessage(message);
                setShowErrorModal(true); 
            }
        });
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    const closeMintSuccessModal = () => {
        setShowMintSuccessModal(false);
        navigate('/gallery');
    };

    const handleConnectWallet = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            const connectButton = document.querySelector('[data-testid="connect-button"]') as HTMLElement;
            if (connectButton) {
                connectButton.focus();
            }
        }, 500);
    };

return (
        <section className="min-h-screen flex flex-col items-center text-center pt-20 pb-20">
            {/* Header Section */}
            <div className="w-full max-w-4xl px-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 mt-16">
                    ImmersivΞ 3D NFT
                </h2>
                <p className="text-sm sm:text-base lg:text-lg opacity-80 mb-10 md:mb-10">
                    Bring Digital Art to Life — Discover immersive AR experiences.
                </p>

                {/* === Enter AR Button for Android === */}
                <div className="flex justify-center mb-8">
                    <Link
                        to="/ar-rotate"
                        className="w-full max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px]
                                px-6 py-3 border-2 rounded-lg
                                text-lg font-medium text-center
                                border-[var(--text-color)] text-[var(--text-color)]
                                hover:bg-[var(--text-color)] hover:text-[var(--bg-color)]
                                transition-all duration-300 ease-in-out
                                transform hover:scale-[1.02] active:scale-[0.98]
                                hover:shadow-lg"
                    >
                    Enter AR [Android]
                    </Link>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full max-w-6xl px-4">
                <div className="w-full flex justify-center">
                    <div className="flex flex-col items-center">

                        {/* === Google Model-viewer === */}
                        <model-viewer 
                        className="w-[350px] md:w-[400px] lg:w-[450px] xl:w-[500px] 
                                    h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] 
                                    rounded-lg model-viewer-bg mb-5"
                        src="/nft-assets/nft.glb" // LOCAL: dev use only — for production, switch to Walrus / IPFS
                        ar 
                        ar-modes="webxr scene-viewer quick-look"
                        ar-button-text="View in your space"
                        ar-scale="auto" 
                        camera-controls 
                        auto-rotate
                        touch-action="pan-y" 
                        alt="A 3D NFT artwork with AR experience." 
                        shadow-intensity="2" 
                        skybox-height="2m" 
                        max-camera-orbit="auto 90deg auto" 
                        ios-src="/nft-assets/nft.usdz" 
                        tone-mapping="commerce"
                        xr-environment
                        >                    
                        </model-viewer>                                        
                    </div>
                </div>

                {/* === Free Mint Now Button === */}
                <div className="w-full max-w-4xl px-4">
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={handleMint}
                            disabled={isMinting}
                            className="w-full max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] 
                                    px-6 py-3 border-2 rounded-lg 
                                    text-lg font-semibold text-center 
                                    border-[var(--text-color)] text-[var(--text-color)] 
                                    hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] 
                                    transition-all duration-300 ease-in-out 
                                    transform hover:scale-[1.02] active:scale-[0.98] 
                                    hover:shadow-lg
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isMinting ? 'Minting...' : 'Free Mint Now'}
                        </button>
                    </div>
                    <NumberMinted />
                </div>

                {/* === AR user manual === */}
                <div className="w-full max-w-md mx-auto px-4 mt-8">
                    <div className="bg-[var(--bg-color)] text-[var(--text-color)] rounded-lg shadow-xl border border-white/30 p-4">
                        <h3 className="text-lg font-semibold mb-2">Quick Tips:</h3>
                        <ul className="list-none text-sm space-y-2">
                            <li>
                                <span className="font-semibold">Rotate 3D:</span> Click & drag (desktop) or swipe (mobile).<br />
                                <span className="font-semibold">Zoom 3D:</span> Scroll mouse (desktop) or pinch (mobile).
                            </li>                            
                            <li className="my-4">
                                <span className="text-lg font-semibold block mb-2">View in AR:</span>
                                <ul className="list-none ml-4 space-y-1">
                                    <li>
                                        <span className="font-semibold">
                                            <MdViewInAr className="inline-block align-middle mr-1" />
                                            AR Button:
                                        </span> Look for the white cube (AR) icon above to view in your space (mobile only)
                                    </li><br />
                                    <li>
                                        <span className="font-semibold">Enter AR [Android] :</span> Button specifically for Android devices • Tap model to change between 5 blue shades
                                    </li>
                                </ul>
                            </li>                            
                            <li className="my-4">
                                <span className="text-lg font-semibold block mb-2">Device Support:</span>
                                <ul className="list-none ml-4 space-y-1">
                                    <li><span className="font-semibold">iPhone/iPad:</span> iOS 12+ (Quick Look)</li>
                                    <li><span className="font-semibold">Android:</span> Chrome recommended</li><br />                                
                                    <li><span className="font-semibold">Desktop:</span> 3D view only • AR requires mobile</li><br />
                                    <li><span className="font-semibold">Best Experience: Try on your phone or tablet!</span></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* === Modals === */}
            <WalletAlert 
                show={showWalletAlert}
                onClose={() => setShowWalletAlert(false)}
                onConnectWallet={handleConnectWallet}
            />
            <MintedSuccessModal 
                show={showMintSuccessModal}
                onClose={closeMintSuccessModal}
            />
        </section>
    );
}

export default Hero;