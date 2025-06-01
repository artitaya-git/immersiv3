import React, { useEffect, useRef, useState } from 'react'; 
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * VRPage Component: Renders a 360° panoramic scene using Three.js.
 * Enhanced with simple glowing neon spheres.
 */
const VRPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const sphereRef = useRef<THREE.Mesh | null>(null);
    const vrButtonRef = useRef<HTMLElement | null>(null);
    const floatingSpheresRef = useRef<THREE.InstancedMesh | null>(null);
    const isInitializedRef = useRef(false);
    const controlsRef = useRef<OrbitControls | null>(null);
    const [isVrButtonInitialized, setIsVrButtonInitialized] = useState(false);

    // Device detection for responsive optimization
    const isMobile = /android|iPad|iPhone|iPod/i.test(navigator.userAgent) ||
        (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1);

    // Main useEffect for Three.js setup and scene initialization
    useEffect(() => {
        if (isInitializedRef.current) {
            console.log('--- VRPage ALREADY INITIALIZED (skipping init) ---');
            return;
        }
        isInitializedRef.current = true;

        let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
        let controls: OrbitControls;

        function init() {
            console.log('Running init() function...');
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);
            sceneRef.current = scene;

            // Setup camera with VR-optimized positioning  
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
            camera.position.set(0, 1.6, 0); // Standard VR eye height
            cameraRef.current = camera;

            // WebXR-enabled renderer 
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            renderer.domElement.style.zIndex = '1';
            renderer.xr.enabled = true;
            rendererRef.current = renderer;

            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                containerRef.current.appendChild(renderer.domElement);

                const vrButton = VRButton.createButton(renderer);
                vrButton.id = 'VRButton';
                
                if (isMobile) {
                    vrButton.style.bottom = '40px'; 
                }
                
                vrButtonRef.current = vrButton;
                containerRef.current.appendChild(vrButton);
                setIsVrButtonInitialized(true);

                vrButton.addEventListener('click', () => {
                    console.log('VR Button clicked');
                });
            }

            scene.add(new THREE.AmbientLight(0xffffff, 0.6));
            const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
            hemiLight.position.set(0, 20, 0);
            scene.add(hemiLight);

            // Load 360° panoramic texture
            const texturePath = '/media/tunnel.webp';
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(texturePath, (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;

                // Create inverted sphere for 360° viewing from inside
                const sphereGeometry = new THREE.SphereGeometry(50, 60, 40);
                sphereGeometry.scale(-1, 1, 1);
                const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphereRef.current = sphere;
                scene.add(sphere);
                console.log('360° texture loaded successfully');
                createGlowingSpheres();
            }, undefined, (error) => {
                console.error('An error occurred while loading the texture:', error);
            });

            function createGlowingSpheres() {
                // Performance-optimized particle counts
                const sphereCount = isMobile ? 150 : 300;
                const geometry = new THREE.SphereGeometry(0.06, 16, 12);
                const material = new THREE.MeshBasicMaterial({
                    color: 0x00DDFF,
                    transparent: true,
                    opacity: 0.8,
                });

                // Use InstancedMesh for efficient rendering of many objects
                const instancedSpheres = new THREE.InstancedMesh(geometry, material, sphereCount);
                floatingSpheresRef.current = instancedSpheres;

                const sphereData = new Array(sphereCount);
                const matrix = new THREE.Matrix4();

                // Generate particles in spherical distribution
                for (let i = 0; i < sphereCount; i++) {
                    const radius = 6 + Math.random() * 15;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;

                    const position = new THREE.Vector3(
                        radius * Math.sin(phi) * Math.cos(theta),
                        (Math.random() - 0.5) * 10,
                        radius * Math.sin(phi) * Math.sin(theta)
                    );

                    matrix.setPosition(position);
                    instancedSpheres.setMatrixAt(i, matrix);

                    // Store animation data for each particle
                    sphereData[i] = {
                        originalPosition: position,
                        floatSpeed: Math.random() * 0.02 + 0.005,
                        floatOffset: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.02,
                    };
                }
                instancedSpheres.instanceMatrix.needsUpdate = true;
                (instancedSpheres as any).sphereData = sphereData;
                scene.add(instancedSpheres);
            }

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.rotateSpeed = 0.3;
            controls.target.set(0, 1.6, -1);
            controls.update();
            controlsRef.current = controls;

            window.addEventListener('resize', onWindowResize);
        }

        function onWindowResize() {
            if (!cameraRef.current || !rendererRef.current) return;
            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            if (!rendererRef.current) return;
            rendererRef.current.setAnimationLoop(() => {
                if (controlsRef.current) {
                    controlsRef.current.update();
                }
                const time = Date.now() * 0.001;
                if (sphereRef.current) {
                    sphereRef.current.rotation.y += 0.001;
                }
                if (floatingSpheresRef.current && (floatingSpheresRef.current as any).sphereData) {
                    const instancedSpheres = floatingSpheresRef.current;
                    const sphereData = (instancedSpheres as any).sphereData;
                    const matrix = new THREE.Matrix4();
                    const euler = new THREE.Euler();
                    const scaleVec = new THREE.Vector3();
                    for (let i = 0; i < sphereData.length; i++) {
                        const data = sphereData[i];
                        const newY = data.originalPosition.y + Math.sin(time * data.floatSpeed + data.floatOffset) * 1.5;
                        euler.set(
                            time * data.rotationSpeed,
                            time * data.rotationSpeed * 1.5,
                            time * data.rotationSpeed * 0.5
                        );
                        const pulse = 1 + Math.sin(time * 2.5 + data.floatOffset) * 0.2;
                        scaleVec.set(pulse, pulse, pulse);
                        matrix.makeRotationFromEuler(euler);
                        matrix.setPosition(data.originalPosition.x, newY, data.originalPosition.z);
                        matrix.scale(scaleVec);
                        instancedSpheres.setMatrixAt(i, matrix);
                    }
                    instancedSpheres.instanceMatrix.needsUpdate = true;
                }
                if (sceneRef.current && cameraRef.current) {
                    rendererRef.current?.render(sceneRef.current, cameraRef.current);
                }
            });
        }

        init();
        animate();

        return () => {
            // Cleanup to prevent memory leaks
            window.removeEventListener('resize', onWindowResize);

            if (rendererRef.current) {
                rendererRef.current.setAnimationLoop(null);
                rendererRef.current.renderLists.dispose();
                rendererRef.current.info.reset();
                rendererRef.current.dispose();
                const gl = rendererRef.current.getContext();
                if (gl && gl.getExtension('WEBGL_lose_context')) {
                    gl.getExtension('WEBGL_lose_context')?.loseContext();
                    console.log('WebGL context lost successfully.');
                }
                if (rendererRef.current.domElement && containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
                    containerRef.current.removeChild(rendererRef.current.domElement);
                }
                rendererRef.current = null;
            }

            if (sceneRef.current) {
                sceneRef.current.traverse((object: THREE.Object3D) => {
                    if (object instanceof THREE.Mesh) {
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) {
                            if (Array.isArray(object.material)) {
                                object.material.forEach(material => material.dispose());
                            } else {
                                object.material.dispose();
                            }
                        }
                    }
                });
                sceneRef.current.clear();
                sceneRef.current = null;
            }

            cameraRef.current = null;

            if (sphereRef.current) {
                sphereRef.current.geometry?.dispose();
                (sphereRef.current.material as THREE.Material)?.dispose();
                sphereRef.current = null;
            }
            if (floatingSpheresRef.current) {
                floatingSpheresRef.current.geometry?.dispose();
                (floatingSpheresRef.current.material as THREE.Material)?.dispose();
                floatingSpheresRef.current = null;
            }
            if (controlsRef.current) {
                controlsRef.current.dispose();
                controlsRef.current = null;
            }

            if (vrButtonRef.current && vrButtonRef.current.parentNode) {
                vrButtonRef.current.parentNode.removeChild(vrButtonRef.current);
            }
            vrButtonRef.current = null;
            
            isInitializedRef.current = false;
            setIsVrButtonInitialized(false); // Reset state
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="immersiv3-vr-container w-full h-screen fixed top-0 left-0"
            style={{ zIndex: 1 }}
        >
        </div>
    );
};

export default VRPage;