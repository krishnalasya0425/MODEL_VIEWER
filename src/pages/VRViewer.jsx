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
import { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";
import { useSearchParams } from "react-router-dom";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
const store = createXRStore();
useGLTF.preload = true;

// ------------------ MODEL COMPONENT ------------------
const Model = ({ url }) => {
  const { scene } = useGLTF(url, true);

  useEffect(() => {
    // Compute bounding box to auto-fit massive models
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center); // center model at origin

    // Smart scaling based on model size (for 500MB+ models)
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 2 / maxDim;
    scene.scale.setScalar(scaleFactor);

    // Enable shadows and visibility
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          obj.material.side = 2;
          obj.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
};

// ------------------ RENDERER READY ------------------
function RendererReady({ onReady }) {
  const { gl } = useThree();
  useEffect(() => {
    if (gl) onReady(gl);
  }, [gl, onReady]);
  return null;
}

// ------------------ VR JOYSTICK ZOOM ------------------
function VRZoomControls({ camera }) {
  useFrame(() => {
    const session = store?.session || navigator.xr?.session;
    if (!session) return;

    for (const source of session.inputSources) {
      const gamepad = source?.gamepad;
      if (gamepad && gamepad.axes.length >= 4) {
        // Left joystick (axes[2], axes[3]) - rotate/orbit
        const rotateX = gamepad.axes[2];
        const rotateY = gamepad.axes[3];
        camera.rotation.y -= rotateX * 0.03; // horizontal rotation
        camera.rotation.x -= rotateY * 0.02; // vertical rotation (clamped)
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

        // Right joystick (axes[1]) - zoom
        const zoomInput = -gamepad.axes[1];
        camera.position.addScaledVector(
          camera.getWorldDirection(new THREE.Vector3()),
          zoomInput * 0.05
        );
      }
    }
  });
  return null;
}

function VRZoomControlsWrapper() {
  const { camera } = useThree();
  return <VRZoomControls camera={camera} />;
}


// ------------------ MAIN COMPONENT ------------------
export default function VRViewer() {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("file");
  const modelUrl = fileId ? `http://localhost:5000/api/projects/file/${fileId}` : null;

  const [xrSupported, setXrSupported] = useState(false);
  const [vrActive, setVrActive] = useState(false);
  const [renderer, setRenderer] = useState(null);
  const canvasRef = useRef();

  // Detect WebXR support
  useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported("immersive-vr").then(setXrSupported);
    } else {
      console.warn("WebXR not supported in this browser");
    }
  }, []);

  // Maintain canvas size when not in VR
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

  // ------------------ VR START HANDLER ------------------
  const handleViewInVR = async () => {
    console.log("🎯 VR button clicked, checking support...");

    if (!navigator.xr) {
      alert("WebXR not supported in this browser.");
      return;
    }

    try {
      if (!renderer) {
        console.warn("⏳ Waiting for renderer initialization...");
        await new Promise((resolve) => {
          const check = setInterval(() => {
            if (renderer) {
              clearInterval(check);
              resolve();
            }
          }, 100);
        });
        console.log("✅ Renderer ready, continuing WebXR startup...");
      }

      const isSupported = await navigator.xr.isSessionSupported("immersive-vr");
      console.log("VR support status:", isSupported);
      if (!isSupported) {
        alert("VR not supported. Connect your headset via Link or Air Link.");
        return;
      }

      if (window.activeXRSession && !window.activeXRSession.ended) {
        await new Promise((res) => {
          window.activeXRSession.addEventListener("end", res, { once: true });
          window.activeXRSession.end();
        });
        window.activeXRSession = null;
      }

      const sessionInit = {
        requiredFeatures: ["local-floor"],
        optionalFeatures: ["bounded-floor"],
      };

      console.log("🟢 Requesting immersive-vr session...");
      const session = await navigator.xr.requestSession("immersive-vr", sessionInit);
      window.activeXRSession = session;
      console.log("✅ WebXR session started");

      if (!renderer) {
        console.error("Renderer not ready yet");
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.xr.enabled = true;

      await renderer.xr.setSession(session);
      console.log("🚀 XR session linked (R3F drives the frame loop)");

      session.addEventListener("end", () => {
        console.log("🚪 XR session ended");
        window.activeXRSession = null;
        setVrActive(false);
      });

      setVrActive(true);
    } catch (err) {
      console.error("❌ WebXR launch error:", err);
      alert(`Could not start VR session: ${err.message || err.name}`);
    }
  };

  // ------------------ UI RENDER ------------------
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
        }}
      >
        <XR store={store}>
          {/* Lighting setup */}
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <color attach="background" args={["#d9d9d9"]} />
          <hemisphereLight intensity={1.3} groundColor="gray" />
          <ambientLight intensity={2.0} />
          <directionalLight position={[10, 10, 10]} intensity={2.2} castShadow />
          <Environment preset="city" background={false} />

          {/* Center model at user's eye level */}
          <group position={[0, -1.6, -2]}>
            {modelUrl && <Model url={modelUrl} />}
          </group>

          {/* Desktop orbit controls */}
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

          {/* VR joystick zoom (unchanged) */}
          <VRZoomControlsWrapper />

          {/* ✅ Add working VR controllers */}
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

          {/* Controller rays */}
          <group>
            <mesh position={[0, 1.5, -1]}>
              <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
              <meshBasicMaterial color="purple" />
            </mesh>
            <mesh position={[0.05, 1.5, -1]}>
              <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
              <meshBasicMaterial color="purple" />
            </mesh>
          </group>

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
