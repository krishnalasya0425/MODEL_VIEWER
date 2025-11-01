//cubne visible with air link
// import { useEffect, useState, useRef } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";
// import { XR, createXRStore } from "@react-three/xr";
// import { useSearchParams } from "react-router-dom";

// const store = createXRStore();
// useGLTF.preload = true;

// const Model = ({ url }) => {
//   const { scene } = useGLTF(url, true);
//   return <primitive object={scene} scale={1} />;
// };

// // Get the renderer instance from R3F (no loop here)
// function RendererReady({ onReady }) {
//   const { gl } = useThree();
//   useEffect(() => {
//     if (gl) onReady(gl);
//   }, [gl, onReady]);
//   return null;
// }

// export default function VRViewer() {
//   const [searchParams] = useSearchParams();
//   const fileId = searchParams.get("file");
//   const modelUrl = fileId ? `http://localhost:5000/api/projects/file/${fileId}` : null;

//   const [xrSupported, setXrSupported] = useState(false);
//   const [vrActive, setVrActive] = useState(false);
//   const [renderer, setRenderer] = useState(null);

//   const canvasRef = useRef();

//   // Detect WebXR
//   useEffect(() => {
//     if (navigator.xr) {
//       navigator.xr.isSessionSupported("immersive-vr").then(setXrSupported);
//     } else {
//       console.warn("WebXR not supported in this browser");
//     }
//   }, []);

//   // Keep canvas sized while NOT presenting (avoid resize spam during XR)
//   useEffect(() => {
//     if (!renderer) return;
//     const onResize = () => {
//       if (!renderer.xr.isPresenting) {
//         renderer.setSize(window.innerWidth, window.innerHeight, false);
//       }
//     };
//     window.addEventListener("resize", onResize);
//     onResize();
//     return () => window.removeEventListener("resize", onResize);
//   }, [renderer]);

//   const handleViewInVR = async () => {
//     console.log("🎯 VR button clicked, checking support...");

//     if (!navigator.xr) {
//       alert("WebXR not supported in this browser.");
//       return;
//     }

//     try {
//        if (!renderer) {
//       console.warn("⏳ Waiting for renderer initialization...");
//       await new Promise(resolve => {
//         const check = setInterval(() => {
//           if (renderer) {
//             clearInterval(check);
//             resolve();
//           }
//         }, 100);
//       });
//       console.log("✅ Renderer ready, continuing WebXR startup...");
//     }
//       const isSupported = await navigator.xr.isSessionSupported("immersive-vr");
//       console.log("VR support status:", isSupported);
//       if (!isSupported) {
//         alert("VR not supported. Connect your headset via Link or Air Link.");
//         return;
//       }

//       // End any existing session cleanly
//       if (window.activeXRSession && !window.activeXRSession.ended) {
//         await new Promise((res) => {
//           window.activeXRSession.addEventListener("end", res, { once: true });
//           window.activeXRSession.end();
//         });
//         window.activeXRSession = null;
//       }

//       // Safe features for Meta Link / OpenXR on desktop
//       const sessionInit = {
//         requiredFeatures: ["local-floor"],
//         optionalFeatures: ["bounded-floor"], // no 'layers', no 'hand-tracking' to avoid stalls
//       };

//       console.log("🟢 Requesting immersive-vr session...");
//       const session = await navigator.xr.requestSession("immersive-vr", sessionInit);
//       window.activeXRSession = session;
//       console.log("✅ WebXR session started");

//       if (!renderer) {
//         console.error("Renderer not ready yet");
//         return;
//       }

//       // Prepare renderer BEFORE binding the session
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//       renderer.setSize(window.innerWidth, window.innerHeight, false);
//       renderer.xr.enabled = true;

//       // Hand off to R3F/XR: no manual setAnimationLoop!
//       await renderer.xr.setSession(session);
//       console.log("🚀 XR session linked (R3F drives the frame loop)");

//       session.addEventListener("end", () => {
//         console.log("🚪 XR session ended");
//         window.activeXRSession = null;
//         setVrActive(false);
//       });

//       setVrActive(true);
//     } catch (err) {
//       console.error("❌ WebXR launch error:", err);
//       alert(`Could not start VR session: ${err.message || err.name}`);
//     }
//   };

//   return (
//     <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
//       {!vrActive && (
//         <button
//           onClick={handleViewInVR}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md mb-4"
//         >
//           View This Model in VR
//         </button>
//       )}

//       <Canvas
//         ref={canvasRef}
//         camera={{ position: [0, 1.6, 3], fov: 75 }}
//         gl={{ antialias: true }}
//         onCreated={({ gl, scene }) => {
//           // expose to XR render path
//           gl.scene = scene;
//           // cap DPR early to reduce GPU pressure when XR starts
//           gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//           gl.setSize(window.innerWidth, window.innerHeight, false);
//         }}
//       >
//         <XR store={store}>
//   {/* Add better lighting so dark GLB materials are visible */}
//   <hemisphereLight intensity={0.8} groundColor="gray" />
//   <ambientLight intensity={1.2} />
//   <pointLight position={[10, 10, 10]} intensity={1.5} />

//   {/* Optional debug cube — helps confirm rendering works */}
//   <mesh position={[0, 1.5, -2]}>
//     <boxGeometry args={[0.5, 0.5, 0.5]} />
//     <meshStandardMaterial color="orange" />
//   </mesh>

//   {/* Load the model if available */}
//   {modelUrl && <Model url={modelUrl} />}


//           {/* Disable controls while in VR to avoid camera thrash */}
//           <OrbitControls makeDefault enableDamping={false} enabled={!vrActive} />

//           <RendererReady onReady={setRenderer} />
//         </XR>
//       </Canvas>

//       {!xrSupported && (
//         <p className="text-sm text-gray-600 mt-3">
//           ⚠️ VR bridge connection failed. Connect your Meta Quest 3 via Air Link or USB.
//         </p>
//       )}
//     </div>
//   );
// }
//bmp is working in vr
// import { useEffect, useState, useRef } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, useGLTF,Environment } from "@react-three/drei";
// import { XR, createXRStore } from "@react-three/xr";
// import { useSearchParams } from "react-router-dom";
// import * as THREE from "three";

// const store = createXRStore();
// useGLTF.preload = true;

// const Model = ({ url }) => {
//   const { scene } = useGLTF(url, true);

//   useEffect(() => {
//     // Compute bounding box to auto-fit massive models
//     const box = new THREE.Box3().setFromObject(scene);
//     const size = new THREE.Vector3();
//     box.getSize(size);
//     const center = new THREE.Vector3();
//     box.getCenter(center);
//     scene.position.sub(center); // center the model at origin

//     // Smart scaling based on model size (for 500MB+ models)
//     const maxDim = Math.max(size.x, size.y, size.z);
//     const scaleFactor = 2 / maxDim; // ensures it fits in view
//     scene.scale.setScalar(scaleFactor);

//     // Enable shadows and ensure visibility
//     scene.traverse((obj) => {
//       if (obj.isMesh) {
//         obj.castShadow = true;
//         obj.receiveShadow = true;
//         if (obj.material) {
//           obj.material.side = 2;
//           obj.material.needsUpdate = true;
//         }
//       }
//     });
//   }, [scene]);

//   return <primitive object={scene} />;
// };

// // Get the renderer instance from R3F (no loop here)
// function RendererReady({ onReady }) {
//   const { gl } = useThree();
//   useEffect(() => {
//     if (gl) onReady(gl);
//   }, [gl, onReady]);
//   return null;
// }

// export default function VRViewer() {
//   const [searchParams] = useSearchParams();
//   const fileId = searchParams.get("file");
//   const modelUrl = fileId ? `http://localhost:5000/api/projects/file/${fileId}` : null;

//   const [xrSupported, setXrSupported] = useState(false);
//   const [vrActive, setVrActive] = useState(false);
//   const [renderer, setRenderer] = useState(null);

//   const canvasRef = useRef();

//   // Detect WebXR
//   useEffect(() => {
//     if (navigator.xr) {
//       navigator.xr.isSessionSupported("immersive-vr").then(setXrSupported);
//     } else {
//       console.warn("WebXR not supported in this browser");
//     }
//   }, []);

//   // Keep canvas sized while NOT presenting (avoid resize spam during XR)
//   useEffect(() => {
//     if (!renderer) return;
//     const onResize = () => {
//       if (!renderer.xr.isPresenting) {
//         renderer.setSize(window.innerWidth, window.innerHeight, false);
//       }
//     };
//     window.addEventListener("resize", onResize);
//     onResize();
//     return () => window.removeEventListener("resize", onResize);
//   }, [renderer]);

//   const handleViewInVR = async () => {
//     console.log("🎯 VR button clicked, checking support...");

//     if (!navigator.xr) {
//       alert("WebXR not supported in this browser.");
//       return;
//     }

//     try {
//        if (!renderer) {
//       console.warn("⏳ Waiting for renderer initialization...");
//       await new Promise(resolve => {
//         const check = setInterval(() => {
//           if (renderer) {
//             clearInterval(check);
//             resolve();
//           }
//         }, 100);
//       });
//       console.log("✅ Renderer ready, continuing WebXR startup...");
//     }
//       const isSupported = await navigator.xr.isSessionSupported("immersive-vr");
//       console.log("VR support status:", isSupported);
//       if (!isSupported) {
//         alert("VR not supported. Connect your headset via Link or Air Link.");
//         return;
//       }

//       // End any existing session cleanly
//       if (window.activeXRSession && !window.activeXRSession.ended) {
//         await new Promise((res) => {
//           window.activeXRSession.addEventListener("end", res, { once: true });
//           window.activeXRSession.end();
//         });
//         window.activeXRSession = null;
//       }

//       // Safe features for Meta Link / OpenXR on desktop
//       const sessionInit = {
//         requiredFeatures: ["local-floor"],
//         optionalFeatures: ["bounded-floor"], // no 'layers', no 'hand-tracking' to avoid stalls
//       };

//       console.log("🟢 Requesting immersive-vr session...");
//       const session = await navigator.xr.requestSession("immersive-vr", sessionInit);
//       window.activeXRSession = session;
//       console.log("✅ WebXR session started");

//       if (!renderer) {
//         console.error("Renderer not ready yet");
//         return;
//       }

//       // Prepare renderer BEFORE binding the session
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//       renderer.setSize(window.innerWidth, window.innerHeight, false);
//       renderer.xr.enabled = true;

//       // Hand off to R3F/XR: no manual setAnimationLoop!
//       await renderer.xr.setSession(session);
//       console.log("🚀 XR session linked (R3F drives the frame loop)");

//       session.addEventListener("end", () => {
//         console.log("🚪 XR session ended");
//         window.activeXRSession = null;
//         setVrActive(false);
//       });

//       setVrActive(true);
//     } catch (err) {
//       console.error("❌ WebXR launch error:", err);
//       alert(`Could not start VR session: ${err.message || err.name}`);
//     }
//   };

//   return (
//     <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
//       {!vrActive && (
//         <button
//           onClick={handleViewInVR}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md mb-4"
//         >
//           View This Model in VR
//         </button>
//       )}

//       <Canvas
//         ref={canvasRef}
//         camera={{ position: [0, 1.6, 3], fov: 75 }}
//         gl={{ antialias: true }}
//         onCreated={({ gl, scene }) => {
//           // expose to XR render path
//           gl.scene = scene;
//           // cap DPR early to reduce GPU pressure when XR starts
//           gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//           gl.setSize(window.innerWidth, window.innerHeight, false);
//         }}
//       >
// <XR store={store}>


//   <pointLight position={[10, 10, 10]} intensity={1.5} />
//   {/* Lighting setup for dark/black materials */}
// <color attach="background" args={["#d9d9d9"]} />
// <hemisphereLight intensity={1.3} groundColor="gray" />
// <ambientLight intensity={2.0} />
// <directionalLight position={[10, 10, 10]} intensity={2.2} castShadow />
// <Environment preset="city" background={false} />


//   {/* Load your BMP model */}
//   {modelUrl && <Model url={modelUrl} />}

//   {/* OrbitControls stays disabled during VR */}
//   <OrbitControls makeDefault enableDamping={false} enabled={!vrActive} />

//   <RendererReady onReady={setRenderer} />
// </XR>

//       </Canvas>

//       {!xrSupported && (
//         <p className="text-sm text-gray-600 mt-3">
//           ⚠️ VR bridge connection failed. Connect your Meta Quest 3 via Air Link or USB.
//         </p>
//       )}
//     </div>
//   );
// }
//model displayed in vr is working 
// import { useEffect, useState, useRef } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
// import { XR, createXRStore } from "@react-three/xr";
// import { useSearchParams } from "react-router-dom";
// import * as THREE from "three";
// import { useFrame } from "@react-three/fiber";
// const store = createXRStore();
// useGLTF.preload = true;

// // ------------------ MODEL COMPONENT ------------------
// const Model = ({ url }) => {
//   const { scene } = useGLTF(url, true);

//   useEffect(() => {
//     // Compute bounding box to auto-fit massive models
//     const box = new THREE.Box3().setFromObject(scene);
//     const size = new THREE.Vector3();
//     box.getSize(size);
//     const center = new THREE.Vector3();
//     box.getCenter(center);
//     scene.position.sub(center); // center model at origin

//     // Smart scaling based on model size (for 500MB+ models)
//     const maxDim = Math.max(size.x, size.y, size.z);
//     const scaleFactor = 2 / maxDim;
//     scene.scale.setScalar(scaleFactor);

//     // Enable shadows and visibility
//     scene.traverse((obj) => {
//       if (obj.isMesh) {
//         obj.castShadow = true;
//         obj.receiveShadow = true;
//         if (obj.material) {
//           obj.material.side = 2;
//           obj.material.needsUpdate = true;
//         }
//       }
//     });
//   }, [scene]);

//   return <primitive object={scene} />;
// };

// // ------------------ RENDERER READY ------------------
// function RendererReady({ onReady }) {
//   const { gl } = useThree();
//   useEffect(() => {
//     if (gl) onReady(gl);
//   }, [gl, onReady]);
//   return null;
// }

// // ------------------ VR JOYSTICK ZOOM ------------------
// function VRZoomControls({ camera }) {
//   useFrame(() => {
//     const session = store?.session || navigator.xr?.session;
//     if (!session) return;

//     for (const source of session.inputSources) {
//       const gamepad = source?.gamepad;
//       if (gamepad && gamepad.axes.length >= 4) {
//         // Left joystick (axes[2], axes[3]) - rotate/orbit
//         const rotateX = gamepad.axes[2];
//         const rotateY = gamepad.axes[3];
//         camera.rotation.y -= rotateX * 0.03; // horizontal rotation
//         camera.rotation.x -= rotateY * 0.02; // vertical rotation (clamped)
//         camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

//         // Right joystick (axes[1]) - zoom
//         const zoomInput = -gamepad.axes[1];
//         camera.position.addScaledVector(
//           camera.getWorldDirection(new THREE.Vector3()),
//           zoomInput * 0.05
//         );
//       }
//     }
//   });
//   return null;
// }

// function VRZoomControlsWrapper() {
//   const { camera } = useThree();
//   return <VRZoomControls camera={camera} />;
// }


// // ------------------ MAIN COMPONENT ------------------
// export default function VRViewer() {
//   const [searchParams] = useSearchParams();
//   const fileId = searchParams.get("file");
//   const modelUrl = fileId ? `http://localhost:5000/api/projects/file/${fileId}` : null;

//   const [xrSupported, setXrSupported] = useState(false);
//   const [vrActive, setVrActive] = useState(false);
//   const [renderer, setRenderer] = useState(null);
//   const canvasRef = useRef();

//   // Detect WebXR support
//   useEffect(() => {
//     if (navigator.xr) {
//       navigator.xr.isSessionSupported("immersive-vr").then(setXrSupported);
//     } else {
//       console.warn("WebXR not supported in this browser");
//     }
//   }, []);

//   // Maintain canvas size when not in VR
//   useEffect(() => {
//     if (!renderer) return;
//     const onResize = () => {
//       if (!renderer.xr.isPresenting) {
//         renderer.setSize(window.innerWidth, window.innerHeight, false);
//       }
//     };
//     window.addEventListener("resize", onResize);
//     onResize();
//     return () => window.removeEventListener("resize", onResize);
//   }, [renderer]);

//   // ------------------ VR START HANDLER ------------------
//   const handleViewInVR = async () => {
//     console.log("🎯 VR button clicked, checking support...");

//     if (!navigator.xr) {
//       alert("WebXR not supported in this browser.");
//       return;
//     }

//     try {
//       if (!renderer) {
//         console.warn("⏳ Waiting for renderer initialization...");
//         await new Promise((resolve) => {
//           const check = setInterval(() => {
//             if (renderer) {
//               clearInterval(check);
//               resolve();
//             }
//           }, 100);
//         });
//         console.log("✅ Renderer ready, continuing WebXR startup...");
//       }

//       const isSupported = await navigator.xr.isSessionSupported("immersive-vr");
//       console.log("VR support status:", isSupported);
//       if (!isSupported) {
//         alert("VR not supported. Connect your headset via Link or Air Link.");
//         return;
//       }

//       if (window.activeXRSession && !window.activeXRSession.ended) {
//         await new Promise((res) => {
//           window.activeXRSession.addEventListener("end", res, { once: true });
//           window.activeXRSession.end();
//         });
//         window.activeXRSession = null;
//       }

//       // ✅ Safe fallback for all VR runtimes
// const sessionInit = {
//   requiredFeatures: ["local"], // "local" always supported
//   optionalFeatures: ["local-floor", "bounded-floor"], // keep others optional
// };


//       console.log("🟢 Requesting immersive-vr session...");
//       // 🧠 Runtime check before session request
// const xrNavigator = navigator.xr;
// if (!xrNavigator) {
//   alert("WebXR not found in navigator. Use Chrome with Meta Quest Link or EdgeXR.");
//   return;
// }

// if (!xrNavigator.requestSession) {
//   alert("Your current OpenXR runtime (SteamVR / Oculus) is not active.\n\n" +
//         "➡ Open the Oculus app and enable Link (or SteamVR), then retry.");
//   return;
// }

//       const session = await navigator.xr.requestSession("immersive-vr", sessionInit);
//       window.activeXRSession = session;
//       console.log("✅ WebXR session started");

//       if (!renderer) {
//         console.error("Renderer not ready yet");
//         return;
//       }

//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//       renderer.setSize(window.innerWidth, window.innerHeight, false);
//       renderer.xr.enabled = true;

//       await renderer.xr.setSession(session);
//       console.log("🚀 XR session linked (R3F drives the frame loop)");

//       session.addEventListener("end", () => {
//         console.log("🚪 XR session ended");
//         window.activeXRSession = null;
//         setVrActive(false);
//       });

//       setVrActive(true);
//     } catch (err) {
//       console.error("❌ WebXR launch error:", err);
//       alert(`Could not start VR session: ${err.message || err.name}`);
//     }
//   };

//   // ------------------ UI RENDER ------------------
//   return (
//     <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
//       {!vrActive && (
//         <button
//           onClick={handleViewInVR}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md mb-4"
//         >
//           View This Model in VR
//         </button>
//       )}

//       <Canvas
//         ref={canvasRef}
//         camera={{ position: [0, 1.6, 3], fov: 75 }}
//         gl={{ antialias: true }}
//         onCreated={({ gl, scene }) => {
//           gl.scene = scene;
//           gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//           gl.setSize(window.innerWidth, window.innerHeight, false);
//         }}
//       >
//         <XR store={store}>
//           {/* Lighting setup */}
//           <pointLight position={[10, 10, 10]} intensity={1.5} />
//           <color attach="background" args={["#d9d9d9"]} />
//           <hemisphereLight intensity={1.3} groundColor="gray" />
//           <ambientLight intensity={2.0} />
//           <directionalLight position={[10, 10, 10]} intensity={2.2} castShadow />
//           <Environment preset="city" background={false} />

//           {/* Center model at user's eye level */}
//           {/* Auto-adjust model position for VR and non-VR */}
// <group position={[0, vrActive ? -1.0 : -1.6, vrActive ? -1.5 : -2]}>
//   {modelUrl && <Model url={modelUrl} />}
// </group>

//           {/* Desktop orbit controls */}
//           <OrbitControls
//             makeDefault
//             enabled={!vrActive}
//             enableDamping
//             dampingFactor={0.05}
//             enableZoom
//             zoomSpeed={0.8}
//             enableRotate
//             rotateSpeed={0.6}
//             enablePan
//             panSpeed={0.5}
//             minDistance={0.5}
//             maxDistance={50}
//           />

//           {/* VR joystick zoom (unchanged) */}
//           <VRZoomControlsWrapper />

//           {/* ✅ Add working VR controllers */}
//           {store?.controllers && store.controllers.length > 0 && (
//   <>
//     {store.controllers.map((ctrl, i) => (
//       <group key={i}>
//         {ctrl.controller && <primitive object={ctrl.controller} />}
//         {ctrl.grip && <primitive object={ctrl.grip} />}
//       </group>
//     ))}
//   </>
// )}

//           {/* Controller rays */}
//           <group>
//             <mesh position={[0, 1.5, -1]}>
//               <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
//               <meshBasicMaterial color="purple" />
//             </mesh>
//             <mesh position={[0.05, 1.5, -1]}>
//               <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
//               <meshBasicMaterial color="purple" />
//             </mesh>
//           </group>

//           <RendererReady onReady={setRenderer} />
//         </XR>

//       </Canvas>

//       {!xrSupported && (
//         <p className="text-sm text-gray-600 mt-3">
//           ⚠️ VR bridge connection failed. Connect your Meta Quest 3 via Air Link or USB.
//         </p>
//       )}
//     </div>
//   );
// }
//working in vr but textures not coming
// import { useEffect, useState, useRef } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
// import { XR, createXRStore } from "@react-three/xr";
// import { useSearchParams } from "react-router-dom";
// import * as THREE from "three";
// import { useFrame } from "@react-three/fiber";
// const store = createXRStore();
// useGLTF.preload = true;

// // ------------------ MODEL COMPONENT ------------------
// const Model = ({ url }) => {
//   const { scene } = useGLTF(url, true);

//   useEffect(() => {
//     // Compute bounding box to auto-fit massive models
//     const box = new THREE.Box3().setFromObject(scene);
//     const size = new THREE.Vector3();
//     box.getSize(size);
//     const center = new THREE.Vector3();
//     box.getCenter(center);
//     scene.position.sub(center); // center model at origin

//     // Smart scaling based on model size (for 500MB+ models)
//     const maxDim = Math.max(size.x, size.y, size.z);
//     const scaleFactor = 2 / maxDim;
//     scene.scale.setScalar(scaleFactor);

//     // Enable shadows and visibility
//     scene.traverse((obj) => {
//       if (obj.isMesh) {
//         obj.castShadow = true;
//         obj.receiveShadow = true;
//         if (obj.material) {
//           obj.material.side = 2;
//           obj.material.needsUpdate = true;
//         }
//       }
//     });
//   }, [scene]);

//   return <primitive object={scene} />;
// };

// // ------------------ RENDERER READY ------------------
// function RendererReady({ onReady }) {
//   const { gl } = useThree();
//   useEffect(() => {
//     if (gl) onReady(gl);
//   }, [gl, onReady]);
//   return null;
// }

// // ------------------ VR JOYSTICK ZOOM ------------------
// function VRZoomControls({ camera }) {
//   useFrame(() => {
//     const session = store?.session || navigator.xr?.session;
//     if (!session) return;

//     for (const source of session.inputSources) {
//       const gamepad = source?.gamepad;
//       if (gamepad && gamepad.axes.length >= 4) {
//         // Left joystick (axes[2], axes[3]) - rotate/orbit
//         const rotateX = gamepad.axes[2];
//         const rotateY = gamepad.axes[3];
//         camera.rotation.y -= rotateX * 0.03; // horizontal rotation
//         camera.rotation.x -= rotateY * 0.02; // vertical rotation (clamped)
//         camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

//         // Right joystick (axes[1]) - zoom
//         const zoomInput = -gamepad.axes[1];
//         camera.position.addScaledVector(
//           camera.getWorldDirection(new THREE.Vector3()),
//           zoomInput * 0.05
//         );
//       }
//     }
//   });
//   return null;
// }

// function VRZoomControlsWrapper() {
//   const { camera } = useThree();
//   return <VRZoomControls camera={camera} />;
// }


// // ------------------ MAIN COMPONENT ------------------
// export default function VRViewer() {
//   const [searchParams] = useSearchParams();
//   const fileId = searchParams.get("file");
//   const modelUrl = fileId ? `http://localhost:5000/api/projects/file/${fileId}` : null;

//   const [xrSupported, setXrSupported] = useState(false);
//   const [vrActive, setVrActive] = useState(false);
//   const [renderer, setRenderer] = useState(null);
//   const canvasRef = useRef();

//   // Detect WebXR support
//   useEffect(() => {
//     if (navigator.xr) {
//       navigator.xr.isSessionSupported("immersive-vr").then(setXrSupported);
//     } else {
//       console.warn("WebXR not supported in this browser");
//     }
//   }, []);

//   // Maintain canvas size when not in VR
//   useEffect(() => {
//     if (!renderer) return;
//     const onResize = () => {
//       if (!renderer.xr.isPresenting) {
//         renderer.setSize(window.innerWidth, window.innerHeight, false);
//       }
//     };
//     window.addEventListener("resize", onResize);
//     onResize();
//     return () => window.removeEventListener("resize", onResize);
//   }, [renderer]);

//   // ------------------ VR START HANDLER ------------------
//   const handleViewInVR = async () => {
//     console.log("🎯 VR button clicked, checking support...");

//     if (!navigator.xr) {
//       alert("WebXR not supported in this browser.");
//       return;
//     }

//     try {
//       if (!renderer) {
//         console.warn("⏳ Waiting for renderer initialization...");
//         await new Promise((resolve) => {
//           const check = setInterval(() => {
//             if (renderer) {
//               clearInterval(check);
//               resolve();
//             }
//           }, 100);
//         });
//         console.log("✅ Renderer ready, continuing WebXR startup...");
//       }

//       const isSupported = await navigator.xr.isSessionSupported("immersive-vr");
//       console.log("VR support status:", isSupported);
//       if (!isSupported) {
//         alert("VR not supported. Connect your headset via Link or Air Link.");
//         return;
//       }

//       if (window.activeXRSession && !window.activeXRSession.ended) {
//         await new Promise((res) => {
//           window.activeXRSession.addEventListener("end", res, { once: true });
//           window.activeXRSession.end();
//         });
//         window.activeXRSession = null;
//       }

//       // ✅ Safe fallback for all VR runtimes
// const sessionInit = {
//   requiredFeatures: ["local"], // "local" always supported
//   optionalFeatures: ["local-floor", "bounded-floor"], // keep others optional
// };


//       console.log("🟢 Requesting immersive-vr session...");
//       // 🧠 Runtime check before session request
// const xrNavigator = navigator.xr;
// if (!xrNavigator) {
//   alert("WebXR not found in navigator. Use Chrome with Meta Quest Link or EdgeXR.");
//   return;
// }

// if (!xrNavigator.requestSession) {
//   alert("Your current OpenXR runtime (SteamVR / Oculus) is not active.\n\n" +
//         "➡ Open the Oculus app and enable Link (or SteamVR), then retry.");
//   return;
// }

//       const session = await navigator.xr.requestSession("immersive-vr", sessionInit);
//       window.activeXRSession = session;
//       console.log("✅ WebXR session started");

//       if (!renderer) {
//         console.error("Renderer not ready yet");
//         return;
//       }

//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//       renderer.setSize(window.innerWidth, window.innerHeight, false);
//       renderer.xr.enabled = true;

//       await renderer.xr.setSession(session);
//       console.log("🚀 XR session linked (R3F drives the frame loop)");

//       session.addEventListener("end", () => {
//         console.log("🚪 XR session ended");
//         window.activeXRSession = null;
//         setVrActive(false);
//       });

//       setVrActive(true);
//     } catch (err) {
//       console.error("❌ WebXR launch error:", err);
//       alert(`Could not start VR session: ${err.message || err.name}`);
//     }
//   };

//   // ------------------ UI RENDER ------------------
//   return (
//     <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
//       {!vrActive && (
//         <button
//           onClick={handleViewInVR}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md mb-4"
//         >
//           View This Model in VR
//         </button>
//       )}

//       <Canvas
//         ref={canvasRef}
//         camera={{ position: [0, 1.6, 3], fov: 75 }}
//         gl={{ antialias: true }}
//         onCreated={({ gl, scene }) => {
//           gl.scene = scene;
//           gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//           gl.setSize(window.innerWidth, window.innerHeight, false);
//         }}
//       >
//         <XR store={store}>
//           {/* Lighting setup */}
//           <pointLight position={[10, 10, 10]} intensity={1.5} />
//           <color attach="background" args={["#d9d9d9"]} />
//           <hemisphereLight intensity={1.3} groundColor="gray" />
//           <ambientLight intensity={2.0} />
//           <directionalLight position={[10, 10, 10]} intensity={2.2} castShadow />
//           <Environment preset="city" background={false} />

//           {/* Center model at user's eye level */}
//           {/* Auto-adjust model position for VR and non-VR */}
// {/* Eye-level alignment */}
// <group position={[0, vrActive ? -1.2 : -1.6, vrActive ? -1.2 : -2]}>
//   {modelUrl && <Model url={modelUrl} />}
// </group>


//           {/* Desktop orbit controls */}
//           <OrbitControls
//             makeDefault
//             enabled={!vrActive}
//             enableDamping
//             dampingFactor={0.05}
//             enableZoom
//             zoomSpeed={0.8}
//             enableRotate
//             rotateSpeed={0.6}
//             enablePan
//             panSpeed={0.5}
//             minDistance={0.5}
//             maxDistance={50}
//           />

//           {/* VR joystick zoom (unchanged) */}
//           <VRZoomControlsWrapper />

//           {/* ✅ Add working VR controllers */}
//           {store?.controllers && store.controllers.length > 0 && (
//   <>
//     {store.controllers.map((ctrl, i) => (
//       <group key={i}>
//         {ctrl.controller && <primitive object={ctrl.controller} />}
//         {ctrl.grip && <primitive object={ctrl.grip} />}
//       </group>
//     ))}
//   </>
// )}

//           {/* Controller rays */}
//           <group>
//             <mesh position={[0, 1.5, -1]}>
//               <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
//               <meshBasicMaterial color="purple" />
//             </mesh>
//             <mesh position={[0.05, 1.5, -1]}>
//               <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
//               <meshBasicMaterial color="purple" />
//             </mesh>
//           </group>

//           <RendererReady onReady={setRenderer} />
//         </XR>

//       </Canvas>

//       {!xrSupported && (
//         <p className="text-sm text-gray-600 mt-3">
//           ⚠️ VR bridge connection failed. Connect your Meta Quest 3 via Air Link or USB.
//         </p>
//       )}
//     </div>
//   );
// }
//recent working with out hanlding errors 
// import { useEffect, useState, useRef } from "react";
// import { Canvas, useThree, useFrame } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
// import { XR, createXRStore } from "@react-three/xr";
// import { useSearchParams } from "react-router-dom";
// import * as THREE from "three";

// const store = createXRStore();
// useGLTF.preload = true;

// // ------------------ MODEL COMPONENT ------------------
// const Model = ({ url }) => {
//   const { scene } = useGLTF(url, true);

//   useEffect(() => {
//     // Compute bounding box to auto-fit massive models
//     const box = new THREE.Box3().setFromObject(scene);
//     const size = new THREE.Vector3();
//     box.getSize(size);
//     const center = new THREE.Vector3();
//     box.getCenter(center);
//     scene.position.sub(center); // center model at origin

//     // Smart scaling based on model size (for 500MB+ models)
//     const maxDim = Math.max(size.x, size.y, size.z);
//     const scaleFactor = 2 / maxDim;
//     scene.scale.setScalar(scaleFactor);

//     // ✅ Enhanced: Fix for missing textures and correct material handling
//     scene.traverse((obj) => {
//       if (obj.isMesh) {
//         obj.castShadow = true;
//         obj.receiveShadow = true;

//         if (obj.material) {
//           obj.material.side = THREE.DoubleSide;
//           obj.material.needsUpdate = true;

//           // Ensure correct texture color encoding
//           if (obj.material.map) {
//             obj.material.map.encoding = THREE.sRGBEncoding;
//             obj.material.map.needsUpdate = true;
//           }
//           if (obj.material.emissiveMap) {
//             obj.material.emissiveMap.encoding = THREE.sRGBEncoding;
//             obj.material.emissiveMap.needsUpdate = true;
//           }
//           if (obj.material.normalMap) {
//             obj.material.normalMap.needsUpdate = true;
//           }

//           // Adjust physically based rendering for better look
//           if (obj.material.isMeshStandardMaterial) {
//             obj.material.metalness = Math.min(obj.material.metalness ?? 0.4, 0.6);
//             obj.material.roughness = Math.max(obj.material.roughness ?? 0.3, 0.5);
//             obj.material.envMapIntensity = 1.2;
//           }
//         }
//       }
//     });

//     scene.traverse((child) => {
//       if (child.isMesh && child.material && child.material.map) {
//         child.material.map.encoding = THREE.sRGBEncoding;
//       }
//     });

//     scene.updateMatrixWorld(true);
//   }, [scene]);

//   return <primitive object={scene} />;
// };

// // ------------------ RENDERER READY ------------------
// function RendererReady({ onReady }) {
//   const { gl } = useThree();
//   useEffect(() => {
//     if (gl) onReady(gl);
//   }, [gl, onReady]);
//   return null;
// }

// // ------------------ VR JOYSTICK ZOOM ------------------
// function VRZoomControls({ camera }) {
//   useFrame(() => {
//     const session = store?.session || navigator.xr?.session;
//     if (!session) return;

//     for (const source of session.inputSources) {
//       const gamepad = source?.gamepad;
//       if (gamepad && gamepad.axes.length >= 4) {
//         // Left joystick (axes[2], axes[3]) - rotate/orbit
//         const rotateX = gamepad.axes[2];
//         const rotateY = gamepad.axes[3];
//         camera.rotation.y -= rotateX * 0.03;
//         camera.rotation.x -= rotateY * 0.02;
//         camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

//         // Right joystick (axes[1]) - zoom
//         const zoomInput = -gamepad.axes[1];
//         camera.position.addScaledVector(
//           camera.getWorldDirection(new THREE.Vector3()),
//           zoomInput * 0.05
//         );
//       }
//     }
//   });
//   return null;
// }

// function VRZoomControlsWrapper() {
//   const { camera } = useThree();
//   return <VRZoomControls camera={camera} />;
// }

// // ------------------ MAIN COMPONENT ------------------
// export default function VRViewer() {
//   const [searchParams] = useSearchParams();
//   const fileId = searchParams.get("file");
//   const modelUrl = fileId ? `http://localhost:5000/api/projects/file/${fileId}` : null;

//   const [xrSupported, setXrSupported] = useState(false);
//   const [vrActive, setVrActive] = useState(false);
//   const [renderer, setRenderer] = useState(null);
//   const canvasRef = useRef();

//   // Detect WebXR support
//   useEffect(() => {
//     if (navigator.xr) {
//       navigator.xr.isSessionSupported("immersive-vr").then(setXrSupported);
//     } else {
//       console.warn("WebXR not supported in this browser");
//     }
//   }, []);

//   // Maintain canvas size when not in VR
//   useEffect(() => {
//     if (!renderer) return;
//     const onResize = () => {
//       if (!renderer.xr.isPresenting) {
//         renderer.setSize(window.innerWidth, window.innerHeight, false);
//       }
//     };
//     window.addEventListener("resize", onResize);
//     onResize();
//     return () => window.removeEventListener("resize", onResize);
//   }, [renderer]);

//   // ------------------ VR START HANDLER ------------------
//   const handleViewInVR = async () => {
//     console.log("🎯 VR button clicked, checking support...");

//     if (!navigator.xr) {
//       alert("WebXR not supported in this browser.");
//       return;
//     }

//     try {
//       if (!renderer) {
//         console.warn("⏳ Waiting for renderer initialization...");
//         await new Promise((resolve) => {
//           const check = setInterval(() => {
//             if (renderer) {
//               clearInterval(check);
//               resolve();
//             }
//           }, 100);
//         });
//         console.log("✅ Renderer ready, continuing WebXR startup...");
//       }

//       const isSupported = await navigator.xr.isSessionSupported("immersive-vr");
//       console.log("VR support status:", isSupported);
//       if (!isSupported) {
//         alert("VR not supported. Connect your headset via Link or Air Link.");
//         return;
//       }

//       if (window.activeXRSession && !window.activeXRSession.ended) {
//         await new Promise((res) => {
//           window.activeXRSession.addEventListener("end", res, { once: true });
//           window.activeXRSession.end();
//         });
//         window.activeXRSession = null;
//       }

//       const sessionInit = {
//         requiredFeatures: ["local"],
//         optionalFeatures: ["local-floor", "bounded-floor"],
//       };

//       console.log("🟢 Requesting immersive-vr session...");
//       const xrNavigator = navigator.xr;
//       if (!xrNavigator) {
//         alert("WebXR not found in navigator. Use Chrome with Meta Quest Link or EdgeXR.");
//         return;
//       }

//       if (!xrNavigator.requestSession) {
//         alert("Your current OpenXR runtime (SteamVR / Oculus) is not active.\n\n" +
//               "➡ Open the Oculus app and enable Link (or SteamVR), then retry.");
//         return;
//       }

//       const session = await navigator.xr.requestSession("immersive-vr", sessionInit);
//       window.activeXRSession = session;
//       console.log("✅ WebXR session started");

//       if (!renderer) {
//         console.error("Renderer not ready yet");
//         return;
//       }

//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//       renderer.setSize(window.innerWidth, window.innerHeight, false);
//       renderer.xr.enabled = true;

//       // ✅ Fix textures in VR by setting tone mapping
//       renderer.outputEncoding = THREE.sRGBEncoding;
//       renderer.toneMapping = THREE.ACESFilmicToneMapping;
//       renderer.toneMappingExposure = 1.0;

//       await renderer.xr.setSession(session);
//       console.log("🚀 XR session linked (R3F drives the frame loop)");

//       session.addEventListener("end", () => {
//         console.log("🚪 XR session ended");
//         window.activeXRSession = null;
//         setVrActive(false);
//       });

//       setVrActive(true);
//     } catch (err) {
//       console.error("❌ WebXR launch error:", err);
//       alert(`Could not start VR session: ${err.message || err.name}`);
//     }
//   };

//   // ------------------ UI RENDER ------------------
//   return (
//     <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
//       {!vrActive && (
//         <button
//           onClick={handleViewInVR}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md mb-4"
//         >
//           View This Model in VR
//         </button>
//       )}

//       <Canvas
//         ref={canvasRef}
//         camera={{ position: [0, 1.6, 3], fov: 75 }}
//         gl={{ antialias: true }}
//         onCreated={({ gl, scene }) => {
//           gl.scene = scene;
//           gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//           gl.setSize(window.innerWidth, window.innerHeight, false);
//           // ✅ Apply tone mapping for realistic textures even before VR mode
//           gl.outputEncoding = THREE.sRGBEncoding;
//           gl.toneMapping = THREE.ACESFilmicToneMapping;
//           gl.toneMappingExposure = 1.0;
//         }}
//       >
//         <XR store={store}>
//           {/* Lighting setup */}
//           <pointLight position={[10, 10, 10]} intensity={1.5} />
//           <color attach="background" args={["#d9d9d9"]} />
//           <hemisphereLight intensity={1.3} groundColor="gray" />
//           <ambientLight intensity={2.0} />
//           <directionalLight position={[10, 10, 10]} intensity={2.2} castShadow />
//           <Environment preset="city" background={false} />

//           {/* Center model at user's eye level */}
//           <group position={[0, vrActive ? -1.2 : -1.6, vrActive ? -1.2 : -2]}>
//             {modelUrl && <Model url={modelUrl} />}
//           </group>

//           <OrbitControls
//             makeDefault
//             enabled={!vrActive}
//             enableDamping
//             dampingFactor={0.05}
//             enableZoom
//             zoomSpeed={0.8}
//             enableRotate
//             rotateSpeed={0.6}
//             enablePan
//             panSpeed={0.5}
//             minDistance={0.5}
//             maxDistance={50}
//           />

//           <VRZoomControlsWrapper />

//           {/* ✅ Add working VR controllers */}
//           {store?.controllers && store.controllers.length > 0 && (
//             <>
//               {store.controllers.map((ctrl, i) => (
//                 <group key={i}>
//                   {ctrl.controller && <primitive object={ctrl.controller} />}
//                   {ctrl.grip && <primitive object={ctrl.grip} />}
//                 </group>
//               ))}
//             </>
//           )}

//           {/* Controller rays */}
//           <group>
//             <mesh position={[0, 1.5, -1]}>
//               <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
//               <meshBasicMaterial color="purple" />
//             </mesh>
//             <mesh position={[0.05, 1.5, -1]}>
//               <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
//               <meshBasicMaterial color="purple" />
//             </mesh>
//           </group>

//           <RendererReady onReady={setRenderer} />
//         </XR>
//       </Canvas>

//       {!xrSupported && (
//         <p className="text-sm text-gray-600 mt-3">
//           ⚠️ VR bridge connection failed. Connect your Meta Quest 3 via Air Link or USB.
//         </p>
//       )}
//     </div>
//   );
// }
//working fine in vr 
// import { useEffect, useState, useRef } from "react";
// import { Canvas, useThree, useFrame } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
// import { XR, createXRStore } from "@react-three/xr";
// import { useSearchParams } from "react-router-dom";
// import * as THREE from "three";

// const store = createXRStore();
// useGLTF.preload = true;

// // ------------------ MODEL COMPONENT ------------------
// const Model = ({ url }) => {
//   const { scene } = useGLTF(url, true);

//   useEffect(() => {
//     const box = new THREE.Box3().setFromObject(scene);
//     const size = new THREE.Vector3();
//     box.getSize(size);
//     const center = new THREE.Vector3();
//     box.getCenter(center);
//     scene.position.sub(center);

//     const maxDim = Math.max(size.x, size.y, size.z);
//     const scaleFactor = 2 / maxDim;
//     scene.scale.setScalar(scaleFactor);

//     scene.traverse((obj) => {
//       if (obj.isMesh) {
//         obj.castShadow = true;
//         obj.receiveShadow = true;
//         if (obj.material) {
//           obj.material.side = THREE.DoubleSide;
//           if (obj.material.map) obj.material.map.encoding = THREE.sRGBEncoding;
//           if (obj.material.emissiveMap)
//             obj.material.emissiveMap.encoding = THREE.sRGBEncoding;
//           if (obj.material.isMeshStandardMaterial) {
//             obj.material.metalness = Math.min(obj.material.metalness ?? 0.4, 0.6);
//             obj.material.roughness = Math.max(obj.material.roughness ?? 0.3, 0.5);
//             obj.material.envMapIntensity = 1.2;
//           }
//         }
//       }
//     });
//     scene.updateMatrixWorld(true);
//   }, [scene]);

//   return <primitive object={scene} />;
// };

// // ------------------ RENDERER READY ------------------
// function RendererReady({ onReady }) {
//   const { gl } = useThree();
//   useEffect(() => {
//     if (gl) onReady(gl);
//   }, [gl, onReady]);
//   return null;
// }

// // ------------------ VR JOYSTICK ZOOM ------------------

// function VRZoomControls({ camera, renderer }) {
//   const [userEyeHeight, setUserEyeHeight] = useState(1.2);
//   const [modelDistance, setModelDistance] = useState(2.0);

//   useEffect(() => {
//     const detectHeight = () => {     
//        const session = renderer?.xr?.getSession?.();
//       if (!session) return;
//    session.requestAnimationFrame((t, frame) => {
//         const refSpace = renderer.xr.getReferenceSpace?.();
//         const pose = frame?.getViewerPose(refSpace);
//         if (pose) {
//           const y = pose.transform.position.y;
//           if (y && y > 0.3 && y < 2.5) {
//             setUserEyeHeight(y);
//           }
//         }
//       });


//       if (session.inputSources.length === 0) {
//         console.log("⚠️ No controllers detected yet in XR session.");
//       } else {
//         for (const source of session.inputSources) {
//           console.log("🎮 Controller source:", source.handedness, source.profiles, source.gamepad);
//           const gp = source?.gamepad;
//           if (!gp || !gp.axes) {
//             console.log("🚫 No gamepad or axes data on controller:", source.handedness);
//           }
//         }
//       }
//     };

//     const interval = setInterval(detectHeight, 1000);
//     return () => clearInterval(interval);
//   }, [renderer]);

//   useFrame(() => {
//     const session = renderer?.xr?.getSession?.();
//     if (!session) return;

//     for (const source of session.inputSources) {
//       const gp = source?.gamepad;
//       if (!gp || !gp.axes) continue;

//       const lx = gp.axes[0] ?? 0;
//       const ly = gp.axes[1] ?? 0;
//       const rx = gp.axes[2] ?? 0;
//       const ry = gp.axes[3] ?? 0;

//       // rotation
//       camera.rotation.y -= rx * 0.03;
//       camera.rotation.x -= ry * 0.02;
//       camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

//       // zoom
//       const zoomChange = -ly * 0.05;
//       camera.position.addScaledVector(
//         camera.getWorldDirection(new THREE.Vector3()),
//         zoomChange
//       );

//       // pan
//       const right = new THREE.Vector3();
//       camera.getWorldDirection(right);
//       right.cross(camera.up).normalize();
//       camera.position.addScaledVector(right, lx * 0.03);
//     }

//     camera.position.y = userEyeHeight;
//   });

//   return null;
// }




// function VRZoomControlsWrapper({ renderer }) {
//   const { camera } = useThree();
//   return <VRZoomControls camera={camera} renderer={renderer}/>;
// }

// // ------------------ MAIN COMPONENT ------------------
// export default function VRViewer() {
//   const [searchParams] = useSearchParams();
//   const fileId = searchParams.get("file");
//   const modelUrl = fileId ? `http://localhost:5000/api/projects/file/${fileId}` : null;

//   const [xrSupported, setXrSupported] = useState(false);
//   const [vrActive, setVrActive] = useState(false);
//   const [renderer, setRenderer] = useState(null);
//   const canvasRef = useRef();

//   // Detect WebXR + GPU environment
//   useEffect(() => {
//     const checkSystemStatus = async () => {
//       const canvas = document.createElement("canvas");
//       const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
//       if (!gl) {
//         alert("❌ Your GPU or browser does not support WebGL — VR cannot run on this system.");
//         return;
//       }

//       const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
//       const rendererName = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unknown GPU";
//       console.log("🎮 GPU Detected:", rendererName);

//       if (navigator.xr) {
//         const supported = await navigator.xr.isSessionSupported("immersive-vr");
//         console.log("🧩 VR Support:", supported);
//         setXrSupported(supported);
//       } else {
//         console.warn("⚠️ navigator.xr not found — WebXR runtime inactive");
//         setXrSupported(false);
//       }
//     };
//     checkSystemStatus();
//   }, []);

//   // Maintain canvas resize when not in VR
//   useEffect(() => {
//     if (!renderer) return;
//     const onResize = () => {
//       if (!renderer.xr.isPresenting) {
//         renderer.setSize(window.innerWidth, window.innerHeight, false);
//       }
//     };
//     window.addEventListener("resize", onResize);
//     onResize();
//     return () => window.removeEventListener("resize", onResize);
//   }, [renderer]);

//   // ------------------ ENHANCED VR HANDLER ------------------
//   const handleViewInVR = async () => {
//     console.log("🎯 VR button clicked, checking environment...");

//     const statusBox = document.createElement("div");
//     statusBox.style.position = "fixed";
//     statusBox.style.bottom = "20px";
//     statusBox.style.right = "20px";
//     statusBox.style.padding = "12px 18px";
//     statusBox.style.background = "rgba(0,0,0,0.85)";
//     statusBox.style.color = "#fff";
//     statusBox.style.border = "1px solid #8b5cf6";
//     statusBox.style.borderRadius = "8px";
//     statusBox.style.zIndex = "9999";
//     statusBox.style.fontSize = "14px";
//     statusBox.style.maxWidth = "400px";
//     document.body.appendChild(statusBox);

//     const showStatus = (msg, color = "#a78bfa") => {
//       statusBox.style.borderColor = color;
//       statusBox.innerHTML = msg;
//     };

//     try {
//       // ✅ Check GPU
//       const canvas = document.createElement("canvas");
//       const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
//       if (!gl) {
//         showStatus("❌ No GPU WebGL support detected. Update graphics drivers or use a VR-ready GPU.", "#f87171");
//         return;
//       }

//       const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
//       const rendererName = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unknown GPU";
//       console.log("🧠 GPU Detected:", rendererName);

//       const lowEndGPUs = ["intel", "microsoft basic", "llvmpipe"];
//       if (lowEndGPUs.some((g) => rendererName.toLowerCase().includes(g))) {
//         showStatus(`⚠️ Your GPU (${rendererName}) may not support VR rendering smoothly.`, "#facc15");
//       }

//       // ✅ Check WebXR
//       if (!navigator.xr) {
//         showStatus(`
//           ❌ WebXR not supported on this browser.<br/>
//           👉 Use <b>Chrome</b> or <b>Edge</b> (latest).<br/>
//           ⚙️ Ensure Oculus/SteamVR is running.
//         `, "#f87171");
//         return;
//       }

//       const isSupported = await navigator.xr.isSessionSupported("immersive-vr");
//       if (!isSupported) {
//         showStatus(`
//           ⚠️ VR session not supported.<br/>
//           🧩 Tips:<br/>
//           • Open Oculus App & connect headset<br/>
//           • Enable Oculus Link or Air Link<br/>
//           • Set Oculus as active OpenXR runtime<br/>
//           • Restart Chrome after connecting headset
//         `, "#facc15");
//         return;
//       }

//       if (!renderer) {
//         showStatus("⚠️ Renderer not ready yet, please wait a few seconds.", "#facc15");
//         return;
//       }

//       // ✅ Start Session
//       showStatus("🟢 Starting immersive VR session...");
//       const sessionInit = {
//         requiredFeatures: ["local"],
//         optionalFeatures: ["local-floor", "bounded-floor"],
//       };

//       const session = await navigator.xr.requestSession("immersive-vr", sessionInit);
//       window.activeXRSession = session;
//       showStatus("🚀 VR session started successfully!");

//       renderer.xr.enabled = true;
//       renderer.outputEncoding = THREE.sRGBEncoding;
//       renderer.toneMapping = THREE.ACESFilmicToneMapping;
//       renderer.toneMappingExposure = 1.0;

//       await new Promise((r) => setTimeout(r, 300)); // small wait before linking
//       await renderer.xr.setSession(session);

//       session.addEventListener("end", () => {
//         showStatus("🚪 VR session ended.");
//         setVrActive(false);
//         setTimeout(() => statusBox.remove(), 2000);
//       });

//       setVrActive(true);

//     } catch (err) {
//   console.error("❌ WebXR launch error:", err);
//   const message = err?.message || err?.name || "Unknown error";

//   // 🧠 Network / Wi-Fi disconnected
//   if (!navigator.onLine) {
//     showStatus(`
//       ⚠️ Network connection lost.<br/>
//       • Please reconnect Wi-Fi or Ethernet.<br/>
//       • Ensure Meta Quest and PC share the same 5 GHz Wi-Fi.<br/>
//       • Then retry launching VR.
//     `, "#facc15");
//     return;
//   }

//   // 🥽 OpenXR / Oculus runtime not set
//   if (message.includes("The specified session configuration is not supported")) {
//     showStatus(`
//       ❌ VR runtime not configured properly.<br/>
//       🧩 Possible causes:<br/>
//       • Oculus Link or Air Link not active<br/>
//       • OpenXR runtime not set to Oculus<br/>
//       • Headset sleeping or disconnected<br/>
//       • Wi-Fi instability during session request<br/><br/>
//       🔧 Fix:<br/>
//       1️⃣ Open <b>Oculus app → Settings → General → Set as Active OpenXR Runtime</b><br/>
//       2️⃣ Reconnect headset (USB / Air Link)<br/>
//       3️⃣ Ensure Wi-Fi between PC & Quest is stable<br/>
//       4️⃣ Restart Chrome and try again
//     `, "#f87171");
//     return;
//   }

//   // 🧱 WebXR not available or browser mismatch
//   if (message.toLowerCase().includes("not supported") || message.toLowerCase().includes("webxr")) {
//     showStatus(`
//       ⚠️ WebXR not fully supported by this environment.<br/>
//       • Use latest Chrome or Edge.<br/>
//       • Verify “WebXR” and “WebXR Gamepad Module” are enabled in chrome://flags.<br/>
//       • Try launching directly from Meta Quest Browser.
//     `, "#facc15");
//     return;
//   }

//   // 🧩 Permissions issue
//   if (message.toLowerCase().includes("permission") || message.includes("DOMException")) {
//     showStatus(`
//       ⚠️ Browser blocked VR session.<br/>
//       🔑 Allow Motion Sensor / VR permissions:<br/>
//       • Chrome → Site Settings → Permissions → Enable Motion Sensors & VR<br/>
//       • Then relaunch this page.
//     `, "#facc15");
//     return;
//   }

//   // 🔌 Hardware / cable issue
//   if (message.toLowerCase().includes("hardware") || message.toLowerCase().includes("device")) {
//     showStatus(`
//       ❌ No VR hardware detected.<br/>
//       • Check Oculus/SteamVR is running.<br/>
//       • Reconnect USB / Air Link cable.<br/>
//       • Restart browser.
//     `, "#f87171");
//     return;
//   }

//   // 🌀 Fallback
//   showStatus(`
//     ❌ Could not start VR session:<br/>
//     ${message}<br/><br/>
//     🧩 Try:<br/>
//     • Restart Chrome<br/>
//     • Check OpenXR runtime<br/>
//     • Reconnect headset<br/>
//     • Verify Wi-Fi connection
//   `, "#f87171");
// }

//     }


//   // ------------------ RENDER ------------------
//   return (
//     <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
//       {!vrActive && (
//         <button
//           onClick={handleViewInVR}
//           className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md mb-4"
//         >
//           View This Model in VR
//         </button>
//       )}

//       <Canvas
//         ref={canvasRef}
//         camera={{ position: [0, 1.6, 3], fov: 75 }}
//         gl={{ antialias: true }}
//         onCreated={({ gl, scene }) => {
//           gl.scene = scene;
//           gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//           gl.setSize(window.innerWidth, window.innerHeight, false);
//           gl.outputEncoding = THREE.sRGBEncoding;
//           gl.toneMapping = THREE.ACESFilmicToneMapping;
//           gl.toneMappingExposure = 1.0;
//         }}
//       >
//         <XR store={store}>
//           <pointLight position={[10, 10, 10]} intensity={1.5} />
//           <color attach="background" args={["#d9d9d9"]} />
//           <hemisphereLight intensity={1.3} groundColor="gray" />
//           <ambientLight intensity={2.0} />
//           <directionalLight position={[10, 10, 10]} intensity={2.2} castShadow />
//           <Environment preset="city" background={false} />


//           {/* 🧍 Dynamically place model 2m in front of user's eyes */}
//           <group position={[0, -0.5, -3]}>
//             {modelUrl && <Model url={modelUrl} />}
//           </group>



//           <OrbitControls
//             makeDefault
//             enabled={!vrActive}
//             enableDamping
//             dampingFactor={0.05}
//             enableZoom
//             zoomSpeed={0.8}
//             enableRotate
//             rotateSpeed={0.6}
//             enablePan
//             panSpeed={0.5}
//             minDistance={0.5}
//             maxDistance={50}
//           />

//           <VRZoomControlsWrapper renderer={renderer} />

//           {store?.controllers && store.controllers.length > 0 && (
//             <>
//               {store.controllers.map((ctrl, i) => (
//                 <group key={i}>
//                   {ctrl.controller && <primitive object={ctrl.controller} />}
//                   {ctrl.grip && <primitive object={ctrl.grip} />}
//                 </group>
//               ))}
//             </>
//           )}



//           <RendererReady onReady={setRenderer} />
//         </XR>
//       </Canvas>

//       {!xrSupported && (
//         <p className="text-sm text-gray-600 mt-3">
//           ⚠️ VR bridge connection failed. Connect your Meta Quest 3 via Air Link or USB.
//         </p>
//       )}
//     </div>
//   );
// }
import { useEffect, useState, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";
import { useSearchParams } from "react-router-dom";
import * as THREE from "three";

const store = createXRStore();
useGLTF.preload = true;


const Model = ({ url }) => {
  const { scene } = useGLTF(url, true);

  useEffect(() => {

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    const maxDim = Math.max(size.x || 1, size.y || 1, size.z || 1);
    const scaleFactor = 2 / maxDim; 
    scene.scale.setScalar(scaleFactor);


    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          obj.material.side = THREE.DoubleSide;
          if (obj.material.map) obj.material.map.encoding = THREE.sRGBEncoding;
          if (obj.material.emissiveMap)
            obj.material.emissiveMap.encoding = THREE.sRGBEncoding;
          if (obj.material.isMeshStandardMaterial) {
            obj.material.metalness = Math.min(obj.material.metalness ?? 0.4, 0.6);
            obj.material.roughness = Math.max(obj.material.roughness ?? 0.3, 0.5);
            obj.material.envMapIntensity = 1.2;
          }
        }
      }
    });


    scene.userData.initialScale = scene.scale.x ?? 1;
    scene.name = scene.name || "loaded-gltf-scene";

    scene.updateMatrixWorld(true);
  }, [scene]);

  return <primitive object={scene} />;
};


function RendererReady({ onReady }) {
  const { gl } = useThree();
  useEffect(() => {
    if (gl) onReady(gl);
  }, [gl, onReady]);
  return null;
}


function VRZoomControls({ camera, renderer }) {
  const [userEyeHeight, setUserEyeHeight] = useState(1.2);
  const modelGroup = useRef(null);
  const rotationSpeed = 1.2; 
  const zoomSpeed = 0.5; 
  const scaleState = useRef({ current: 1, min: 0.2, max: 5, initial: 1 });
  const debug = false;

 
  const findModelGroup = () => {
    if (!renderer?.scene) return null;

    const tagged = renderer.scene.getObjectByName("loaded-gltf-scene");
    if (tagged) return tagged;

   
    let found = null;
    renderer.scene.traverse((obj) => {
      if (found) return;
      if (obj.userData?.initialScale) {
        found = obj;
      }
    });
    if (found) return found;

   
    let candidate = null;
    renderer.scene.traverse((obj) => {
      if (candidate) return;
      if ((obj.type === "Group" || obj.type === "Object3D") && obj.children.length > 0) {
 
        let hasMesh = false;
        obj.traverse((c) => {
          if (c.isMesh) hasMesh = true;
        });
        if (hasMesh) candidate = obj;
      }
    });
    return candidate;
  };

 
  useEffect(() => {
    if (!renderer) return;
    const tryFind = () => {
      const mg = findModelGroup();
      if (!mg) return;
      modelGroup.current = mg;
      const initial = mg.scale?.x ?? (mg.userData?.initialScale ?? 1);
      scaleState.current.initial = initial;
      scaleState.current.current = initial;

      scaleState.current.min = Math.max(0.05, initial * 0.2);
      scaleState.current.max = Math.max(initial * 3, initial + 0.1);
      mg.position.z -= 1.2; 

      if (debug) console.log("Model found", mg, "initialScale:", initial, scaleState.current);
    };

  
    tryFind();
    const t = setTimeout(tryFind, 800);
    const t2 = setTimeout(tryFind, 2000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [renderer]);


  useEffect(() => {
    const detectHeight = () => {
      const session = renderer?.xr?.getSession?.();
      if (!session) return;
      session.requestAnimationFrame((t, frame) => {
        try {
          const refSpace = renderer.xr.getReferenceSpace?.();
          const pose = frame?.getViewerPose(refSpace);
          if (pose) {
            const y = pose.transform.position.y;
            if (y && y > 0.3 && y < 2.5) setUserEyeHeight(y);
          }
        } catch (e) {
         
        }
      });
    };
    const interval = setInterval(detectHeight, 1000);
    return () => clearInterval(interval);
  }, [renderer]);

  useFrame(() => {
    const session = renderer?.xr?.getSession?.();
    const model = modelGroup.current;
    if (!session || !model) return;

    
    let totalLX = 0,
      totalLY = 0,
      totalRX = 0,
      totalRY = 0;
    for (const source of session.inputSources) {
      const gp = source?.gamepad;
      if (!gp || !gp.axes) continue;
      
      const axes = gp.axes;
      const lx = axes[0] ?? 0;
      const ly = axes[1] ?? 0;
      const rx = axes[2] ?? 0;
      const ry = axes[3] ?? 0;
      totalLX += lx;
      totalLY += ly;
      totalRX += rx;
      totalRY += ry;
    }

    
    const combinedLR = 0;

    const rotAmount =
      (Math.abs(totalLX) > 0.02 ? totalLX : 0) + (Math.abs(totalRX) > 0.02 ? totalRX : 0);
    if (Math.abs(rotAmount) > 0.02) {

      model.rotation.y -= rotAmount * 0.04 * rotationSpeed;
    }



    const zoomY =
      (Math.abs(totalLY) > 0.02 ? totalLY : 0) + (Math.abs(totalRY) > 0.02 ? totalRY : 0);
    if (Math.abs(zoomY) > 0.01) {

      const delta = zoomY; 
      let nextScale = scaleState.current.current * (1 + delta * (zoomSpeed * 0.02));
      nextScale = THREE.MathUtils.clamp(nextScale, scaleState.current.min, scaleState.current.max);
      scaleState.current.current = nextScale;
      model.scale.setScalar(scaleState.current.current);
      if (debug) console.log("zoomY", zoomY, "scale", scaleState.current.current);
    }



    camera.position.y = userEyeHeight;
  });

  return null;
}

function VRZoomControlsWrapper({ renderer }) {
  const { camera } = useThree();
  return <VRZoomControls camera={camera} renderer={renderer} />;
}


export default function VRViewer() {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("file");
  const modelUrl = fileId ? `http://localhost:5000/api/projects/file/${fileId}` : null;

  const [xrSupported, setXrSupported] = useState(false);
  const [vrActive, setVrActive] = useState(false);
  const [renderer, setRenderer] = useState(null);
  const canvasRef = useRef();


  useEffect(() => {
    const checkSystemStatus = async () => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) {
        alert("❌ Your GPU or browser does not support WebGL — VR cannot run on this system.");
        return;
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const rendererName = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unknown GPU";
      console.log("🎮 GPU Detected:", rendererName);

      if (navigator.xr) {
        const supported = await navigator.xr.isSessionSupported("immersive-vr");
        console.log("🧩 VR Support:", supported);
        setXrSupported(supported);
      } else {
        console.warn("⚠️ navigator.xr not found — WebXR runtime inactive");
        setXrSupported(false);
      }
    };
    checkSystemStatus();
  }, []);


  useEffect(() => {
    if (!renderer) return;
    const onResize = () => {
      if (!renderer.xr.isPresenting) {
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      }
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [renderer]);


  const handleViewInVR = async () => {
    console.log("🎯 VR button clicked, checking environment...");

    const statusBox = document.createElement("div");
    statusBox.style.position = "fixed";
    statusBox.style.bottom = "20px";
    statusBox.style.right = "20px";
    statusBox.style.padding = "12px 18px";
    statusBox.style.background = "rgba(0,0,0,0.85)";
    statusBox.style.color = "#fff";
    statusBox.style.border = "1px solid #8b5cf6";
    statusBox.style.borderRadius = "8px";
    statusBox.style.zIndex = "9999";
    statusBox.style.fontSize = "14px";
    statusBox.style.maxWidth = "400px";
    document.body.appendChild(statusBox);

    const showStatus = (msg, color = "#a78bfa") => {
      statusBox.style.borderColor = color;
      statusBox.innerHTML = msg;
    };

    try {

      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) {
        showStatus("❌ No GPU WebGL support detected. Update graphics drivers or use a VR-ready GPU.", "#f87171");
        return;
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const rendererName = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unknown GPU";
      console.log("🧠 GPU Detected:", rendererName);

      const lowEndGPUs = ["intel", "microsoft basic", "llvmpipe"];
      if (lowEndGPUs.some((g) => rendererName.toLowerCase().includes(g))) {
        showStatus(`⚠️ Your GPU (${rendererName}) may not support VR rendering smoothly.`, "#facc15");
      }


      if (!navigator.xr) {
        showStatus(`
          ❌ WebXR not supported on this browser.<br/>
          👉 Use <b>Chrome</b> or <b>Edge</b> (latest).<br/>
          ⚙️ Ensure Oculus/SteamVR is running.
        `, "#f87171");
        return;
      }

      const isSupported = await navigator.xr.isSessionSupported("immersive-vr");
      if (!isSupported) {
        showStatus(`
          ⚠️ VR session not supported.<br/>
          🧩 Tips:<br/>
          • Open Oculus App & connect headset<br/>
          • Enable Oculus Link or Air Link<br/>
          • Set Oculus as active OpenXR runtime<br/>
          • Restart Chrome after connecting headset
        `, "#facc15");
        return;
      }

      if (!renderer) {
        showStatus("⚠️ Renderer not ready yet, please wait a few seconds.", "#facc15");
        return;
      }


      showStatus("🟢 Starting immersive VR session...");
      const sessionInit = {
        requiredFeatures: ["local"],
        optionalFeatures: ["local-floor", "bounded-floor"],
      };

      const session = await navigator.xr.requestSession("immersive-vr", sessionInit);
      window.activeXRSession = session;
      showStatus("🚀 VR session started successfully!");

      renderer.xr.enabled = true;
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      await new Promise((r) => setTimeout(r, 300));``
      await renderer.xr.setSession(session);

      session.addEventListener("end", () => {
        showStatus("🚪 VR session ended.");
        setVrActive(false);
        setTimeout(() => statusBox.remove(), 2000);
      });

      setVrActive(true);

    } catch (err) {
      console.error("❌ WebXR launch error:", err);
      const message = err?.message || err?.name || "Unknown error";

      if (!navigator.onLine) {
        showStatus(`
          ⚠️ Network connection lost.<br/>
          • Please reconnect Wi-Fi or Ethernet.<br/>
          • Ensure Meta Quest and PC share the same 5 GHz Wi-Fi.<br/>
          • Then retry launching VR.
        `, "#facc15");
        return;
      }

      if (message.includes("The specified session configuration is not supported")) {
        showStatus(`
          ❌ VR runtime not configured properly.<br/>
          🧩 Possible causes:<br/>
          • Oculus Link or Air Link not active<br/>
          • OpenXR runtime not set to Oculus<br/>
          • Headset sleeping or disconnected<br/>
          • Wi-Fi instability during session request<br/><br/>
          🔧 Fix:<br/>
          1️⃣ Open <b>Oculus app → Settings → General → Set as Active OpenXR Runtime</b><br/>
          2️⃣ Reconnect headset (USB / Air Link)<br/>
          3️⃣ Ensure Wi-Fi between PC & Quest is stable<br/>
          4️⃣ Restart Chrome and try again
        `, "#f87171");
        return;
      }

      if (message.toLowerCase().includes("not supported") || message.toLowerCase().includes("webxr")) {
        showStatus(`
          ⚠️ WebXR not fully supported by this environment.<br/>
          • Use latest Chrome or Edge.<br/>
          • Verify “WebXR” and “WebXR Gamepad Module” are enabled in chrome://flags.<br/>
          • Try launching directly from Meta Quest Browser.
        `, "#facc15");
        return;
      }

      if (message.toLowerCase().includes("permission") || message.includes("DOMException")) {
        showStatus(`
          ⚠️ Browser blocked VR session.<br/>
          🔑 Allow Motion Sensor / VR permissions:<br/>
          • Chrome → Site Settings → Permissions → Enable Motion Sensors & VR<br/>
          • Then relaunch this page.
        `, "#facc15");
        return;
      }

      if (message.toLowerCase().includes("hardware") || message.toLowerCase().includes("device")) {
        showStatus(`
          ❌ No VR hardware detected.<br/>
          • Check Oculus/SteamVR is running.<br/>
          • Reconnect USB / Air Link cable.<br/>
          • Restart browser.
        `, "#f87171");
        return;
      }

      showStatus(`
        ❌ Could not start VR session:<br/>
        ${message}<br/><br/>
        🧩 Try:<br/>
        • Restart Chrome<br/>
        • Check OpenXR runtime<br/>
        • Reconnect headset<br/>
        • Verify Wi-Fi connection
      `, "#f87171");
    }
  };

 
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
      {!vrActive && (
        <button
          onClick={handleViewInVR}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md mb-4"
        >
          View This Model in VR
        </button>
      )}

      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 1.6, 3], fov: 75 }}
        gl={{ antialias: true }}
        onCreated={({ gl, scene }) => {
          gl.scene = scene;
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          gl.setSize(window.innerWidth, window.innerHeight, false);
          gl.outputEncoding = THREE.sRGBEncoding;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <XR store={store}>
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <color attach="background" args={["#d9d9d9"]} />
          <hemisphereLight intensity={1.3} groundColor="gray" />
          <ambientLight intensity={2.0} />
          <directionalLight position={[10, 10, 10]} intensity={2.2} castShadow />
          <Environment preset="city" background={false} />

         
          <group position={[0, -0.5, -3]}>
            {modelUrl && <Model url={modelUrl} />}
          </group>

          <OrbitControls
            makeDefault
            enabled={!vrActive}
            enableDamping
            dampingFactor={0.05}
            enableZoom
            zoomSpeed={0.8}
            enableRotate
            rotateSpeed={0.6}
            enablePan
            panSpeed={0.5}
            minDistance={0.5}
            maxDistance={50}
          />

          <VRZoomControlsWrapper renderer={renderer} />

          {store?.controllers && store.controllers.length > 0 && (
            <>
              {store.controllers.map((ctrl, i) => (
                <group key={i}>
                  {ctrl.controller && <primitive object={ctrl.controller} />}
                  {ctrl.grip && <primitive object={ctrl.grip} />}
                </group>
              ))}
            </>
          )}

          <RendererReady onReady={setRenderer} />
        </XR>
      </Canvas>

      {!xrSupported && (
        <p className="text-sm text-gray-600 mt-3">
          ⚠️ VR bridge connection failed. Connect your Meta Quest 3 via Air Link or USB.
        </p>
      )}
    </div>
  );
}
