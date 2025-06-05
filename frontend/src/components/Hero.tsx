import { useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import React, { useState } from 'react';
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
        file_size: "409 KB",
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
            meshes: 900,
            vertices: 608400,
            faces: 1080000,
            materials: "PBR",
            rendered_in: "Three.js",
            specular_map: "Grayscale texture used for specular highlights"
        },
        attributes: [
            { trait_type: "Edition", value: "Prototype" }
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
            <div className="w-full max-w-4xl px-4 mb-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 mt-16">
                    ImmersivΞ 3D NFT
                </h2>
                <p className="text-sm sm:text-base lg:text-lg opacity-80 mb-10">
                    Bring Digital Art to Life — Discover immersive AR experiences.
                </p>
                {/* === Enter AR Button for Android === */}
                <div className="flex justify-center space-x-7">
                    <Link
                        to="/ar-rotate"
                        className="connect-btn px-6 py-2 border border-[var(--text-color)] rounded-md 
                        text-lg hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] mb-1"
                    >
                        {device.isAndroid ? 'Enter AR [Android]' : 'Enter AR'}
                    </Link>
                </div>
            </div>

            <div className="w-full max-w-6xl px-4 flex-1 flex flex-col items-center justify-center">                
                {/* === Google Model-viewer === */}
                <div className="flex flex-col items-center mb-8">
                    <model-viewer
                        className="w-[350px] md:w-[450px] lg:w-[500px] xl:w-[600px] 
                        h-[350px] md:h-[450px] lg:h-[500px] xl:h-[600px] 
                        rounded-lg model-viewer-bg mb-5"
                        src="/nft-assets/nft.glb"
                        alt="3D NFT"
                        camera-controls
                        auto-rotate
                        loading="eager"
                        touch-action="pan-y"
                        disable-pan={false}  
                        disable-zoom={false}
    
                        field-of-view="30deg"                 

                        tone-mapping="commerce"
                        shadow-intensity="0.8"

                        // Try 1
                        // ios-src="/nft-assets/nft.usdz"

                        // Try 2
                        ios-src="/nft-assets/teapot.usdz"

                        // Try 3- delete all ios-src 

                        ar
                        ar-modes="webxr scene-viewer quick-look"
                        ar-scale="auto"
                        environment-image="neutral"
                        seamless-poster
                

                        interaction-policy="always-allow"
                    />

                    {/* === Free Mint Button === */}
                    <button
                        onClick={handleMint}
                        className="connect-btn px-5 py-2 border border-[var(--text-color)] rounded-md 
                        text-lg hover:bg-[var(--text-color)] hover:text-[var(--bg-color)]"
                    >
                        Free Mint Now
                    </button>
                    <NumberMinted />
                </div>

                {/* Quick Tips */}
                <div className="w-full max-w-md">
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
                                    </li>
                                    <li>
                                        <span className="font-semibold">[Enter AR] :</span> Button specifically for Android devices.
                                    </li>
                                </ul>
                            </li>                            
                            <li className="my-4">
                                <span className="text-lg font-semibold block mb-2">Device Support:</span>
                                <ul className="list-none ml-4 space-y-1">
                                    <li><span className="font-semibol">Android:</span> Chrome recommended (WebXR)</li>
                                    <li><span className="font-semibol">iPhone/iPad:</span> iOS 12+ (Quick Look)</li>
                                    <li><span className="font-semibol">Desktop:</span> 3D view only • AR requires mobile</li><br />
                                    <li><span className="font-semibold">Best Experience: Try on your phone or tablet!</span></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>

            {/* Modals */}
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