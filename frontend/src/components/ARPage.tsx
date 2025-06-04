import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

/**
 * ARPage Component: Show 3D model in AR with rotation, and simple wave motion.
 *
 * This component makes a Three.js scene, loads a 3D model from a GLB file,
 * and uses the WebXR API to show the model in the user's real environment.
 */
const ARPage = () => {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const arButtonRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const init = () => {

            const scene = new THREE.Scene();
            sceneRef.current = scene;

            const camera = new THREE.PerspectiveCamera(
                70,
                window.innerWidth / window.innerHeight,
                0.01,
                40
            );
            cameraRef.current = camera;

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.xr.enabled = true; 

            renderer.domElement.style.position = 'fixed';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.width = '100vw';
            renderer.domElement.style.height = '100vh';
            renderer.domElement.style.zIndex = '10';

            // Set default background to solid black (#000000) for non-AR mode
            renderer.setClearColor(0x000000, 1); 

            // Check if a canvas already exists to prevent duplication
            const existingCanvas = document.querySelector('canvas');
            if (!existingCanvas) {
                document.body.appendChild(renderer.domElement);
            }
            rendererRef.current = renderer;

            const ambientLight = new THREE.AmbientLight(0x203899, 1.0);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0x6fbcf0, 1);
            directionalLight.position.set(0.5, 1, 0.3);
            scene.add(directionalLight);

            // === Load the 3D model (GLB file) ===
            const loader = new GLTFLoader();
            loader.load(
                '/nft-assets/nft.glb', // LOCAL: dev use only — for production, switch to Walrus / IPFS
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(0, 0, -2); // Initial position in front of user
                    model.rotation.x = Math.PI / 6;
                    model.scale.set(0.04, 0.04, 0.04);
                    scene.add(model);
                    modelRef.current = model;
                },
                undefined,
                (error) => {
                    console.error('Error loading model:', error);
                }
            );

            if (!modelRef.current) {
                console.warn('Model not loaded yet, check file path or CORS settings');
            }

            const arButton = ARButton.createButton(renderer);
            if (!document.querySelector('#ARButton')) {
                document.body.appendChild(arButton);
            }

            arButtonRef.current = arButton;

            // Adjust background on AR mode entry/exit
            renderer.xr.addEventListener('sessionstart', () => {
                renderer.setClearColor(0x000000, 0); // Set to transparent when entering AR
            });

            renderer.xr.addEventListener('sessionend', () => {
                renderer.setClearColor(0x000000, 1); // Set to solid black when exiting AR
            });

            window.addEventListener('resize', onWindowResize);
        };

        const onWindowResize = () => {
            if (cameraRef.current && rendererRef.current) {
                const camera = cameraRef.current;
                const renderer = rendererRef.current;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        };

        const animate = () => {
            if (rendererRef.current) {
                const clock = new THREE.Clock(); // Add clock for frame-independent animation
                
                rendererRef.current.setAnimationLoop(() => {
                    const deltaTime = clock.getDelta(); // Time elapsed per frame
                    
                    if (modelRef.current && sceneRef.current && cameraRef.current) {
                        modelRef.current.rotation.y += 0.08 * deltaTime; 
                        updatePosition(deltaTime); // Pass deltaTime parameter
                        rendererRef.current!.render(sceneRef.current, cameraRef.current);
                    }
                });
            }
        };

        /**
         * Update position: Move the model to the right with simple wave motion.
         */
        const updatePosition = (deltaTime: number) => { // Accept deltaTime parameter
            if (modelRef.current && rendererRef.current) {
                modelRef.current.position.x += 0.1 * deltaTime; 
                // Wrap left at right boundary
                if (modelRef.current.position.x > 3) {
                    modelRef.current.position.x = -3; 
                }
                modelRef.current.position.y = Math.sin(modelRef.current.position.x) * 0.5;
            }
        };

        // Remove any existing model-viewer elements to avoid conflicts
        const modelViewerElements = document.querySelectorAll('model-viewer');
        modelViewerElements.forEach((element) => {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        });

        init();
        animate();

        // Clean up when the component is removed from the page. Important for performance.
        return () => {

            window.removeEventListener('resize', onWindowResize);

            if (rendererRef.current) {
                rendererRef.current.setAnimationLoop(null); 
                rendererRef.current.xr.enabled = false; 

                // End WebXR session if active
                if (rendererRef.current.xr.isPresenting) {
                    rendererRef.current.xr.getSession()?.end();
                }

                if (rendererRef.current.domElement && document.body.contains(rendererRef.current.domElement)) {
                    document.body.removeChild(rendererRef.current.domElement);
                }

                rendererRef.current.dispose(); // Release WebGL resources
                rendererRef.current = null;
            }

            // Clean up scene objects to prevent memory leaks
            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object instanceof THREE.Mesh) {
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) {
                            if (Array.isArray(object.material)) {
                                object.material.forEach((mat) => mat.dispose());
                            } else {
                                object.material.dispose();
                            }
                        }
                    }
                });
                sceneRef.current.clear();
                sceneRef.current = null;
            }

            const arButtonElements = document.querySelectorAll('#ARButton');
            arButtonElements.forEach((element) => {
                if (element.parentElement) {
                    element.parentElement.removeChild(element);
                }
            });

            if (arButtonRef.current && document.body.contains(arButtonRef.current)) {
                document.body.removeChild(arButtonRef.current);
                arButtonRef.current = null;
            }

            cameraRef.current = null;
            modelRef.current = null;
        };
    }, []);

    return null;
};

export default ARPage;