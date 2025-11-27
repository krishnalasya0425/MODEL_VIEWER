// components/WebGLVRViewer.jsx
import React, { useEffect, useRef } from 'react';

const WebGLVRViewer = ({ webglUrl, onExit }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Inject VR controls into the WebGL build
    const injectVRControls = () => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {

        const vrScript = `
          // VR control injection script
          if (typeof Unity !== 'undefined') {
            // Add VR support to Unity WebGL build
            // This is a placeholder - actual implementation depends on your Unity project
            console.log('VR controls injected into WebGL build');
          }
        `;
        
        try {
          iframe.contentWindow.postMessage({ type: 'INJECT_VR', script: vrScript }, '*');
        } catch (error) {
          console.warn('Could not inject VR controls:', error);
        }
      }
    };

    // Wait for iframe to load
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = injectVRControls;
    }
  }, [webglUrl]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onExit}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Exit VR
        </button>
      </div>
      <iframe
        ref={iframeRef}
        src={webglUrl}
        className="w-full h-full border-0"
        title="WebGL VR Build"
        allow="xr-spatial-tracking; fullscreen"
        allowFullScreen
      />
    </div>
  );
};

export default WebGLVRViewer;