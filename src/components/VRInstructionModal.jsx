// VRInstructionModal.jsx
import { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import VRZoomControlsWrapper from "./VRZoomControlsWrapper"; // your existing VRZoomControlsWrapper
import Model from "./Model"; // your existing Model component

const store = createXRStore();

export default function VRInstructionModal({ modelUrl, onClose, darkMode }) {
  const [vrActive, setVrActive] = useState(false);
  const [headsetConnected, setHeadsetConnected] = useState(false);
  const [pcCompatible, setPcCompatible] = useState(false);
  const [renderer, setRenderer] = useState(null);

  const canvasRef = useRef();

  // Check VR support & PC compatibility
  useEffect(() => {
    const checkVRStatus = async () => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setPcCompatible(!!gl);

      if (navigator.xr) {
        const supported = await navigator.xr.isSessionSupported("immersive-vr");
        setHeadsetConnected(supported);
      } else {
        setHeadsetConnected(false);
      }
    };
    checkVRStatus();
  }, []);

  const handleEnterVR = () => {
    setVrActive(true);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70`}
    >
      <div
        className={`w-[90%] max-w-4xl rounded-xl p-6 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        } shadow-lg relative`}
      >
        <button
          className="absolute top-4 right-4 text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        {!vrActive ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Connect Your VR Headset</h2>

            <div className="mb-4 space-y-2">
              <p>Follow these steps to connect Oculus/PC:</p>
              <ul className="list-disc list-inside">
                <li>Open Oculus App & connect headset via USB or Air Link</li>
                <li>Ensure Oculus Link / Air Link is active</li>
                <li>Set Oculus as active OpenXR runtime</li>
                <li>Use latest Chrome or Edge browser</li>
                <li>Ensure PC & Meta Quest are on same network (for Air Link)</li>
              </ul>
            </div>

            <div className="mb-4 flex gap-6">
              <div>
                <p>VR Headset:</p>
                <p
                  className={`font-bold ${
                    headsetConnected ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {headsetConnected ? "Connected ✅" : "Not Connected ❌"}
                </p>
              </div>
              <div>
                <p>PC Compatibility:</p>
                <p
                  className={`font-bold ${
                    pcCompatible ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {pcCompatible ? "Compatible ✅" : "Not Compatible ❌"}
                </p>
              </div>
            </div>

            <button
              disabled={!headsetConnected || !pcCompatible}
              onClick={handleEnterVR}
              className={`px-4 py-2 rounded-lg text-white font-semibold ${
                headsetConnected && pcCompatible
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              Enter VR
            </button>
          </>
        ) : (
          <div className="w-full h-[70vh]">
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
                setRenderer(gl);
              }}
            >
              <XR store={store}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
                <Environment preset="city" background={false} />

                {modelUrl && <Model url={modelUrl} />}

                <VRZoomControlsWrapper renderer={renderer} />
              </XR>
            </Canvas>
          </div>
        )}
      </div>
    </div>
  );
}
