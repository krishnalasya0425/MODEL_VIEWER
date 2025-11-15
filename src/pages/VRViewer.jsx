import { useEffect, useState, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";
import { useSearchParams, useNavigate } from "react-router-dom";
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
    const scaleFactor = 4 / maxDim; 
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
        } catch (e) {}
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
  const navigate = useNavigate();
  const fileId = searchParams.get("file");
  const modelUrl = fileId ? `http://localhost:5000/api/projects/file/${fileId}` : null;

  const [xrSupported, setXrSupported] = useState(false);
  const [vrActive, setVrActive] = useState(false);
  const [renderer, setRenderer] = useState(null);
  const canvasRef = useRef();

  // Store fileId in sessionStorage when component mounts
  useEffect(() => {
    if (fileId) {
      sessionStorage.setItem('lastModelFileId', fileId);
    }
  }, [fileId]);

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
const handleExitVR = async () => {
  console.log("🔙 Exit VR clicked - preparing to restore modal...");
  
  try {
    // Set flag for modal restoration FIRST - before any navigation
    sessionStorage.setItem("shouldReopenPopup", "true");
    
    // Store the current model info for restoration
    if (fileId && modelUrl) {
      const modelInfo = {
        url: modelUrl,
        name: "3D Model",
        fileId: fileId,
        timestamp: Date.now() // Add timestamp to ensure fresh data
      };
      sessionStorage.setItem("lastModel", JSON.stringify(modelInfo));
      console.log("💾 Stored model info for restoration:", modelInfo);
    }

    // End VR session if active
    if (window.activeXRSession && !window.activeXRSession.ended) {
      await window.activeXRSession.end();
    }
    
    setVrActive(false);
    
    // Force state updates and ensure navigation happens after storage is set
    setTimeout(() => {
      console.log("🔄 Navigating back to dashboard with modal restoration...");
      navigate(-1);
    }, 50); // Reduced delay for faster response
    
  } catch (error) {
    console.error("Error during VR exit:", error);
    // Still navigate back even if there's an error
    sessionStorage.setItem("shouldReopenPopup", "true");
    navigate(-1);
  }
};

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

      await new Promise((r) => setTimeout(r, 300));
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
          • Verify "WebXR" and "WebXR Gamepad Module" are enabled in chrome://flags.<br/>
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
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white relative">
      {/* Exit VR Button - Always visible */}
      <button
        onClick={handleExitVR}
        className="absolute top-4 left-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md z-20 hover:bg-red-700 transition-colors flex items-center gap-2"
      >
        <span>←</span>
        Exit VR
      </button>

      {!vrActive && (
        <button
          onClick={handleViewInVR}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md mb-4 hover:bg-purple-700 transition-colors"
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
        <XR store={store} onSessionStart={() => setVrActive(true)} onSessionEnd={() => setVrActive(false)}>
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <color attach="background" args={["#d9d9d9"]} />
          <hemisphereLight intensity={1.3} groundColor="gray" />
          <ambientLight intensity={2.0} />
          <directionalLight position={[10, 10, 10]} intensity={2.2} castShadow />
          <Environment preset="city" background={false} />

          <group position={[0, -0.5, -3]} name="persistent-model">
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