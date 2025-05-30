import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

/**
 * ARPage Component: Show 3D model in AR with rotation, and simple wave motion.
 *
 * This component makes a Three.js scene, loads a 3D model from a GLB file,
 * and uses the WebXR API to show the model in the user's real environment.
 * The model rotates, moves to the right with wrap-around, and moves up-down like a simple wave.
 */
const ARPage = () => {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const arButtonRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        /**
         * Initial setup: Make scene, camera, renderer, and load the model.
         */
        const init = () => {
            // === 1. Make a scene ===
            const scene = new THREE.Scene();
            sceneRef.current = scene;

            // === 2. Make a camera ===
            const camera = new THREE.PerspectiveCamera(
                70,
                window.innerWidth / window.innerHeight,
                0.01,
                40
            );
            cameraRef.current = camera;

            // === 3. Make a renderer ===
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.xr.enabled = true; // Enable WebXR for AR

            // Set styles so the 3D view covers the whole screen and is on top.
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

            // === 4. Add lights (ambient and directional) ===
            const ambientLight = new THREE.AmbientLight(0x203899, 1.0);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0x6fbcf0, 1);
            directionalLight.position.set(0.5, 1, 0.3);
            scene.add(directionalLight);

            // === 5. Load the 3D model (GLB file) ===
            const loader = new GLTFLoader();
            loader.load(
                '/nft-assets/nft.glb', // LOCAL: dev use only — for production, switch to IPFS or Walrus
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(0, 0, -2); // Initial position in front of user
                    model.rotation.x = Math.PI / 6;
                    model.scale.set(0.04, 0.04, 0.04);
                    scene.add(model);
                    modelRef.current = model;
                    console.log('Model loaded successfully');
                },
                undefined,
                (error) => {
                    console.error('Error loading model:', error);
                }
            );

            // Log to debug model loading issues
            if (!modelRef.current) {
                console.warn('Model not loaded yet, check file path or CORS settings');
            }

            // === 6. Add the AR button (made by ARButton) ===
            const arButton = ARButton.createButton(renderer);
            if (!document.querySelector('#ARButton')) {
                document.body.appendChild(arButton);
            }
            arButtonRef.current = arButton;

            // === Add this section to adjust the background when entering/exiting AR mode ===
            renderer.xr.addEventListener('sessionstart', () => {
                console.log('AR session started. Setting background to transparent.');
                renderer.setClearColor(0x000000, 0); // Set to transparent when entering AR
            });

            renderer.xr.addEventListener('sessionend', () => {
                console.log('AR session ended. Setting background to solid black.');
                renderer.setClearColor(0x000000, 1); // Set to solid black when exiting AR
            });

            // === 7. Add event listener to handle screen resize ===
            window.addEventListener('resize', onWindowResize);
        };

        /**
         * Handle window resize: Update camera and renderer when the screen changes size.
         */
        const onWindowResize = () => {
            if (cameraRef.current && rendererRef.current) {
                const camera = cameraRef.current;
                const renderer = rendererRef.current;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        };

        /**
         * Update position: Move the model to the right with simple wave motion.
         */
        const updatePosition = () => {
            if (modelRef.current && rendererRef.current) {
                // Move right
                modelRef.current.position.x += 0.0035; // Adjust speed
                // Wrap around to the left when reaching the right boundary
                if (modelRef.current.position.x > 3) {
                    modelRef.current.position.x = -3; // Reset to left
                }
                // Simple wave motion (up-down) using Math.sin
                modelRef.current.position.y = Math.sin(modelRef.current.position.x) * 0.5;
            }
        };

        /**
         * Animation loop: Render the scene, rotate the model, and move.
         */
        const animate = () => {
            if (rendererRef.current) {
                rendererRef.current.setAnimationLoop(() => {
                    if (modelRef.current && sceneRef.current && cameraRef.current) {
                        modelRef.current.rotation.y += 0.0025; 
                        updatePosition(); // Move model to the right with wave
                        rendererRef.current!.render(sceneRef.current, cameraRef.current);
                    }
                });
            }
        };

        // Remove any existing model-viewer elements to avoid conflicts
        const modelViewerElements = document.querySelectorAll('model-viewer');
        modelViewerElements.forEach((element) => {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        });

        // Start everything when the component is first added to the page.
        init();
        animate();

        // Clean up when the component is removed from the page. Important for performance.
        return () => {
            console.log('Cleaning up ARPage'); // Debug cleanup

            // Remove event listener
            window.removeEventListener('resize', onWindowResize);

            // Stop animation loop and clean up renderer
            if (rendererRef.current) {
                rendererRef.current.setAnimationLoop(null); // Stop animation loop
                rendererRef.current.xr.enabled = false; // Disable WebXR

                // End WebXR session if active
                if (rendererRef.current.xr.isPresenting) {
                    rendererRef.current.xr.getSession()?.end();
                }

                // Remove renderer from DOM
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

            // Remove ARButton from DOM
            const arButtonElements = document.querySelectorAll('#ARButton');
            arButtonElements.forEach((element) => {
                if (element.parentElement) {
                    element.parentElement.removeChild(element);
                }
            });

            // Remove ARButton reference
            if (arButtonRef.current && document.body.contains(arButtonRef.current)) {
                document.body.removeChild(arButtonRef.current);
                arButtonRef.current = null;
            }

            // Clear remaining references
            cameraRef.current = null;
            modelRef.current = null;

            console.log('ARPage cleanup completed'); // Debug cleanup
        };
    }, []);

    // This component doesn't directly render any HTML elements. The canvas is created in useEffect.
    return null;
};

export default ARPage;