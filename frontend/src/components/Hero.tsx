import { useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import React, { useState } from 'react';
import MintedSuccessModal from './MintedSuccessModal'; 

const PACKAGE_ID = `0x3e1473fb76a629fd4ac4348966f62ee30f93aa9e0da22d965bf8a7f3c02b7f51`;
const MINT_STATE_ID = `0x5227757e15d23dca4d1114985daef482409a395cf4199754bb6ecaf8badff19c`;

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
 * typically involving an introduction to the app's main features
 * and a way to get started (e.g., minting an NFT).
 */
function Hero() {
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const navigate = useNavigate(); 

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showMintSuccessModal, setShowMintSuccessModal] = useState(false);


const handleMint = () => {
    console.log('Initiate NFT Mint on Sui Blockchain');
    const tx = new Transaction();
    const metadata = {
        name: "ImmersivΞ Overflow 2025",
        description: "A 3D NFT artwork with AR experience.",
        image_url: "https://immersiv3.tech/nft-assets/nft-preview.webp", // NOTE: Temporary dev URL — to be updated with IPFS/Walrus in production
        animation_url: "https://immersiv3.tech/nft-assets/nft.glb", // NOTE: Temporary dev URL — to be updated with IPFS/Walrus in production
        file_size: "588 KB",
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
            vertices: 1411344,
            faces: 2571264,
            materials: "PBR",
            rendered_in: "Three.js",
            animation_duration: "4s",
            specular_map: "Grayscale texture used for specular highlights"
        },
        attributes: [
            { trait_type: "Edition", value: "Prototype" }
        ]
    };

    tx.moveCall({
        package: PACKAGE_ID,
        module: 'nft_minter',
        function: 'mint_to_sender',
        arguments: [
            tx.object(MINT_STATE_ID), // shared object
            tx.pure.vector('u8', [...'Immersiv3 Overflow 2025'].map(x => x.charCodeAt(0))), 
            tx.pure.vector('u8', [...'A 3D NFT artwork with AR experience'].map(x => x.charCodeAt(0))), 
            tx.pure.vector('u8', [...'https://immersiv3.tech/nft-assets/nft.glb'].map(x => x.charCodeAt(0))), 
            tx.pure.vector('u8', [...JSON.stringify(metadata)].map(x => x.charCodeAt(0))) // metadata as JSON
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
            setShowErrorModal(true); // Show Modal Error
        }
    });
};

    // Close Modal
    const closeErrorModal = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    const closeMintSuccessModal = () => {
        setShowMintSuccessModal(false);
        navigate('/gallery');
    };

    return (
        <section className="min-h-screen flex flex-col items-center text-center pt-20 pb-20">
        <div className="w-full max-w-4xl px-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 mt-16">
            ImmersivΞ 3D NFT
            </h2>
            <p className="text-sm sm:text-base lg:text-lg opacity-80 mb-8">
            Bring Digital Art to Life — Discover immersive AR experiences.
            </p>

            {/* === Enter AR Buttons / WebXR + Three.js ===*/}
            <div className="flex justify-center space-x-7">
            <Link
                to="/ar-rotate"
                className="connect-btn px-6 py-2 border border-[var(--text-color)] rounded-md 
                text-lg hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] mb-5"
            >
                Enter AR
            </Link>
            </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl px-4">

            {/* === Google Model Viewer === */}
            <div className="w-full flex justify-center">
            <div className="flex flex-col items-center">
                <model-viewer
                className="w-[350px] md:w-[450px] lg:w-[500px] h-[350px] md:h-[450px] lg:h-[500px] 
                rounded-lg model-viewer-bg mb-5"
                src="/nft-assets/nft.glb" // LOCAL: dev use only — for production, switch to IPFS or Walrus
                alt="3D NFT"
                camera-controls
                auto-rotate
                loading="eager"
                touch-action="pan-y"
                tone-mapping="commerce"
                shadow-intensity="0.8"
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
            </div>

            {/* === 3D Viewer + AR user manual === */}
            <div className="w-full max-w-md p-4 mx-auto mt-8 2xl:mt-0 2xl:absolute 2xl:right-10 2xl:top-[76%] 2xl:-translate-y-1/2">
            <div className="bg-[var(--bg-color)] text-[var(--text-color)] rounded-lg shadow-xl border border-white/30 p-4">
                <h3 className="text-lg font-semibold mb-2">Quick Tips:</h3>
                <ul className="list-none text-sm space-y-2">
                <li>
                    <span className="font-semibold">Rotate 3D:</span> Click & drag (desktop) or swipe (mobile).<br></br>
                    <span className="font-semibold">Zoom 3D:</span> Scroll mouse wheel (desktop) or pinch (mobile).
                </li>
                <li className="my-4">
                    <span className="text-lg font-semibold block mb-2">Enter AR:</span>
                    <ul className="list-none ml-4 space-y-1">
                    <li>
                        Tap the <span className="font-semibold">[Enter AR]</span> button to view the object in your real-world space.
                    </li>
                    </ul>
                </li>
                <li className="my-4">
                    <span className="text-lg font-semibold block mb-2">AR Compatibility:</span>
                    <ul className="list-none ml-4 space-y-1">
                    <li><span className="font-semibold">Best on:</span> Android (Chrome, etc.)</li>
                    <li><span className="font-semibold">NOT Supported:</span> Desktop, iPhone.</li>
                    </ul>
                </li>
                </ul>
            </div>
            </div>
        </div>

            <MintedSuccessModal 
                show={showMintSuccessModal}
                onClose={closeMintSuccessModal}
            />
        </section>
    );
}

export default Hero;
