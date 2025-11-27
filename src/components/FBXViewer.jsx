import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
const modelCache = new Map();
export default function FBXViewer({ fileUrl, zoom = 1 }) {
  const mountRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const modelGroupRef = useRef();

  useEffect(() => {
    if (!fileUrl) return;

    const mount = mountRef.current;


    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      5000
    );
    camera.position.set(0, 100, 250);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;


    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1);
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

 
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;


    const ext = fileUrl.split(".").pop().toLowerCase();

    const handleLoadedObject = (object) => {
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      object.position.sub(center);

      const size = box.getSize(new THREE.Vector3()).length();
      camera.position.set(0, size / 2, size * 1.5);
      controls.target.copy(center);
      object.scale.setScalar(0.5);
      modelGroup.add(object);
    };

    if (ext === "fbx") {
      const loader = new FBXLoader();
      fetch(fileUrl)
        .then((res) => res.arrayBuffer())
        .then((data) => {
          loader.parse(data, "", handleLoadedObject);
        })
        .catch((err) => console.error("FBX fetch/parse error:", err));
    } else if (ext === "glb" || ext === "gltf") {
      const loader = new GLTFLoader();
      loader.load(
        fileUrl,
        (gltf) => handleLoadedObject(gltf.scene),
        undefined,
        (err) => console.error("GLB/GLTF load error:", err)
      );
    }


    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();


    return () => {
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [fileUrl]);


useEffect(() => {
  const controls = controlsRef.current;
  const camera = cameraRef.current;
  if (!controls || !camera) return;

  const forward = new THREE.Vector3();
  forward.subVectors(controls.target, camera.position).normalize();

  
  const currentDistance = camera.position.distanceTo(controls.target);

  
  const targetDistance = THREE.MathUtils.clamp(currentDistance / zoom, 20, 1000);

  
  const startPos = camera.position.clone();
  const endPos = new THREE.Vector3().copy(controls.target)
    .add(forward.clone().multiplyScalar(-targetDistance));

  
  const duration = 300;
  const startTime = performance.now();

  const animateZoom = (time) => {
    const t = Math.min((time - startTime) / duration, 1);
    const ease = t * (2 - t);
    camera.position.lerpVectors(startPos, endPos, ease);
    camera.lookAt(controls.target);
    controls.update();
    if (t < 1) requestAnimationFrame(animateZoom);
  };

  requestAnimationFrame(animateZoom);
}, [zoom]);


  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    />
  );
}
