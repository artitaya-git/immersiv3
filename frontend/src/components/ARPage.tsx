import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

interface InteractionState {
    isHovered: boolean;
    currentBlueShade: number;
}

/**
 * Interactive ARPage Component
 * Features: Click to change blue shades, Hover effects, Smooth animations
 */
const ARPage: React.FC = () => {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const arButtonRef = useRef<HTMLElement | null>(null);
    const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
    const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
    const interactionStateRef = useRef<InteractionState>({
        isHovered: false,
        currentBlueShade: 0
    });

    const suiBlueShades = [
        0x4F9CF9, 
        0x0EA5E9, 
        0x00BFFF, 
        0x0284C7,
        0x48CAE9   
    ];

    useEffect(() => {
        const init = (): void => {
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

            renderer.setClearColor(0x000000, 1);

            const existingCanvas = document.querySelector('canvas');
            if (!existingCanvas) {
                document.body.appendChild(renderer.domElement);
            }
            rendererRef.current = renderer;

            // Simple lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 10, 5);
            scene.add(directionalLight);

            // === Load 3D model (GLB file) ===
            const loader = new GLTFLoader();
            loader.load(
                '/nft-assets/nft.glb',
                (gltf) => {
                    const model = gltf.scene;
                    
                    // Hide ground plane for AR-ready models
                    model.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            // Only hide clear ground planes 
                            const geometry = child.geometry;
                            const bbox = new THREE.Box3().setFromObject(child);
                            const size = bbox.getSize(new THREE.Vector3());
                            
                            // Hide only if it's a very large flat plane 
                            if ((geometry instanceof THREE.PlaneGeometry || 
                                geometry instanceof THREE.BoxGeometry) &&
                                size.x > 5 && size.z > 5 && size.y < 0.1) {
                                child.visible = false;
                            }
                            // Hide specific names that are clearly ground
                            else if (child.name && (
                                child.name.toLowerCase().includes('ground') ||
                                child.name.toLowerCase().includes('floor') ||
                                child.name.toLowerCase().includes('base_plane') ||
                                child.name.toLowerCase().includes('ar_plane')
                            )) {
                                child.visible = false;
                            }
                        }
                    });
                    
                    model.position.set(0, 0, -2);
                    model.rotation.x = Math.PI / 6;
                    model.scale.set(2.0, 2.0, 2.0);
                    scene.add(model);
                    modelRef.current = model;
                },
                undefined,
                (error) => {
                    console.error('Error loading model:', error);
                }
            );

            const arButton = ARButton.createButton(renderer);
            if (!document.querySelector('#ARButton')) {
                document.body.appendChild(arButton);
            }
            arButtonRef.current = arButton;

            // Event listeners for interactions
            renderer.domElement.addEventListener('click', onMouseClick);
            renderer.domElement.addEventListener('mousemove', onMouseMove);
            renderer.domElement.addEventListener('touchstart', onTouchStart);

            // AR session event listeners
            renderer.xr.addEventListener('sessionstart', () => {
                renderer.setClearColor(0x000000, 0);
            });

            renderer.xr.addEventListener('sessionend', () => {
                renderer.setClearColor(0x000000, 1);
            });

            window.addEventListener('resize', onWindowResize);
        };

        const getMousePosition = (event: MouseEvent | Touch): void => {
            if (rendererRef.current) {
                const rect = rendererRef.current.domElement.getBoundingClientRect();
                mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            }
        };

        const checkIntersection = (): THREE.Intersection[] => {
            if (!modelRef.current || !cameraRef.current) return [];
            
            raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
            return raycasterRef.current.intersectObject(modelRef.current, true);
        };

        const onMouseMove = (event: MouseEvent): void => {
            getMousePosition(event);
            const intersects = checkIntersection();
            
            if (intersects.length > 0) {
                if (!interactionStateRef.current.isHovered) {
                    interactionStateRef.current.isHovered = true;
                    document.body.style.cursor = 'pointer';
                    
                    // Smooth scale up on hover
                    if (modelRef.current) {
                        animateScale(modelRef.current, 2.3, 300);
                    }
                }
            } else {
                if (interactionStateRef.current.isHovered) {
                    interactionStateRef.current.isHovered = false;
                    document.body.style.cursor = 'default';
                    
                    // Smooth scale back down
                    if (modelRef.current) {
                        animateScale(modelRef.current, 2.0, 300);
                    }
                }
            }
        };

        const onMouseClick = (event: MouseEvent): void => {
            getMousePosition(event);
            handleClick();
        };

        const onTouchStart = (event: TouchEvent): void => {
            event.preventDefault();
            if (event.touches.length > 0) {
                getMousePosition(event.touches[0]);
                handleClick();
            }
        };

        const handleClick = (): void => {
            const intersects = checkIntersection();
            
            if (intersects.length > 0 && modelRef.current) {
                // Change to next blue shade
                interactionStateRef.current.currentBlueShade = 
                    (interactionStateRef.current.currentBlueShade + 1) % suiBlueShades.length;
                
                const newColor = suiBlueShades[interactionStateRef.current.currentBlueShade];
                changeModelColor(newColor);
                
                // Small bounce effect
                animateBounce(modelRef.current);
            }
        };

        const changeModelColor = (color: number): void => {
            if (!modelRef.current) return;
            
            // === Create material with emissive prop for glowing effect ===
            const newMaterial = new THREE.MeshStandardMaterial({ 
                color: color,
                metalness: 0.8,
                roughness: 0.0,
                emissive: new THREE.Color(color), // Same color as base for glow effect
                emissiveIntensity: 0.3, 
                transparent: false,
                side: THREE.FrontSide,
                vertexColors: true 
            });
            
            modelRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    // Dispose old material to prevent memory leaks
                    if (child.material && child.material !== newMaterial) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((mat) => mat.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                    child.material = newMaterial;
                }
            });
        };

        const animateScale = (object: THREE.Object3D, targetScale: number, duration: number): void => {
            const startScale = object.scale.x;
            const startTime = Date.now();
            
            const animate = (): void => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth easing
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentScale = startScale + (targetScale - startScale) * eased;
                
                object.scale.setScalar(currentScale);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
        };

        const animateBounce = (object: THREE.Object3D): void => {
            const originalY = object.position.y;
            const bounceHeight = 0.3;
            const duration = 600;
            const startTime = Date.now();
            
            const animate = (): void => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress <= 1) {
                    // Bounce curve using sine wave
                    const bounceOffset = Math.sin(progress * Math.PI * 2) * bounceHeight * (1 - progress);
                    object.position.y = originalY + bounceOffset;
                    requestAnimationFrame(animate);
                } else {
                    object.position.y = originalY;
                }
            };
            
            animate();
        };

        const onWindowResize = (): void => {
            if (cameraRef.current && rendererRef.current) {
                const camera = cameraRef.current;
                const renderer = rendererRef.current;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        };

        const animate = (): void => {
            if (rendererRef.current) {
                const clock = new THREE.Clock(); // Frame-independent animation clock
                
                rendererRef.current.setAnimationLoop(() => {
                    const deltaTime = clock.getDelta(); // Time elapsed per frame
                    const elapsedTime = clock.getElapsedTime(); // Total elapsed time
                    
                    if (modelRef.current && sceneRef.current && cameraRef.current) {
                        // Frame-independent rotation
                        modelRef.current.rotation.y += 0.3 * deltaTime;
                        
                        // === Controlled floating motion ===
                        const baseY = 0.3; // higher = float higher
                        const floatRange = 0.15; // Small range to stay in frame
                        modelRef.current.position.y = baseY + Math.sin(elapsedTime * 0.5) * floatRange;
                        
                        rendererRef.current!.render(sceneRef.current, cameraRef.current);
                    }
                });
            }
        };

        // Clean up existing elements
        const modelViewerElements = document.querySelectorAll('model-viewer');
        modelViewerElements.forEach((element) => {
            element.parentElement?.removeChild(element);
        });

        init();
        animate();

        // Cleanup function to prevent cache issues
        return () => {
            // Force stop any pending animations immediately
            if (rendererRef.current) {
                rendererRef.current.setAnimationLoop(null);
            }

            window.removeEventListener('resize', onWindowResize);

            if (rendererRef.current) {
                // Remove all event listeners
                const canvas = rendererRef.current.domElement;
                if (canvas) {
                    canvas.removeEventListener('click', onMouseClick);
                    canvas.removeEventListener('mousemove', onMouseMove);
                    canvas.removeEventListener('touchstart', onTouchStart);
                }
                
                // Force disable XR
                rendererRef.current.xr.enabled = false;

                // End any active XR sessions with timeout
                if (rendererRef.current.xr.isPresenting) {
                    const session = rendererRef.current.xr.getSession();
                    if (session) {
                        Promise.race([
                            session.end(),
                            new Promise(resolve => setTimeout(resolve, 500))
                        ]).catch(() => {
                            // Silent cleanup on error
                        });
                    }
                }

                // Dispose renderer safely
                try {
                    rendererRef.current.dispose();
                } catch (e) {
                    // Ignore disposal errors
                }
                
                rendererRef.current = null;
            }

            // Clean up scene objects
            if (sceneRef.current) {
                // Clear all objects
                while (sceneRef.current.children.length > 0) {
                    const child = sceneRef.current.children[0];
                    sceneRef.current.remove(child);
                    
                    if (child instanceof THREE.Mesh) {
                        child.geometry?.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach((mat) => mat.dispose());
                            } else {
                                child.material.dispose();
                            }
                        }
                    }
                }
                sceneRef.current = null;
            }

            // Remove canvas elements from DOM
            const allCanvases = document.querySelectorAll('canvas');
            allCanvases.forEach(canvas => {
                if (canvas.parentElement) {
                    canvas.parentElement.removeChild(canvas);
                }
            });

            // Remove AR button elements
            const arElements = document.querySelectorAll('[id*="AR"], [class*="ar-"], button[style*="ar"]');
            arElements.forEach(element => {
                if (element.parentElement && 
                    (element.id?.includes('AR') || 
                    element.className?.includes('ar') ||
                    element.textContent?.includes('AR'))) {
                    element.parentElement.removeChild(element);
                }
            });

            // Clear AR button ref
            if (arButtonRef.current) {
                if (document.body.contains(arButtonRef.current)) {
                    document.body.removeChild(arButtonRef.current);
                }
                arButtonRef.current = null;
            }

            // Reset document state
            document.body.style.cursor = 'default';
            document.body.style.overflow = '';
            
            // Clear all refs
            cameraRef.current = null;
            modelRef.current = null;
        };
    }, []);

    return null;
};

export default ARPage;