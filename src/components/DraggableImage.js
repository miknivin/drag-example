/* eslint-disable @next/next/no-img-element */
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import dynamic from 'next/dynamic';

// Dynamically import Hammer.js only on client side
const Hammer = dynamic(() => import('hammerjs'), {
  ssr: false,
  loading: () => <div>Loading touch handlers...</div>
});

const DraggableImage = ({ width, height, uploadedImage }) => {
  const nodeRef = useRef(null);
  const imageRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imgWidth, setImgWidth] = useState(200);
  const [imgHeight, setImgHeight] = useState(200);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsClient(true);
    alert('Client-side rendering initialized');
  }, []);

  // Initialize Hammer.js
  useEffect(() => {
    let hammerInstance = null;

    const initHammer = async () => {
      try {
        alert('Attempting to initialize Hammer.js');
        alert(`Checks: ${JSON.stringify({
          isClient,
          hasImageRef: !!imageRef.current,
          hasHammer: !!Hammer
        })}`);

        if (!isClient) {
          alert('Not client side yet');
          return;
        }

        if (!imageRef.current) {
          alert('Image ref not available');
          return;
        }

        if (!Hammer) {
          alert('Hammer.js not loaded');
          return;
        }

        hammerInstance = new Hammer(imageRef.current);
        alert('Hammer instance created');

        // Enable pinch with error handling
        try {
          hammerInstance.get('pinch').set({ enable: true });
          alert('Pinch gesture enabled');
        } catch (err) {
          alert(`Error enabling pinch: ${err.message}`);
          setError('Failed to enable pinch gesture');
        }

        hammerInstance.on('pinch', (e) => {
          try {
            const adjustmentFactor = 2;
            const widthDelta = e.scale > 1 ? adjustmentFactor : -adjustmentFactor;
            const heightDelta = e.scale > 1 ? adjustmentFactor : -adjustmentFactor;

            setImgWidth(prev => Math.min(Math.max(100, prev + widthDelta), width));
            setImgHeight(prev => Math.min(Math.max(100, prev + heightDelta), height));
          } catch (err) {
            alert(`Error in pinch handler: ${err.message}`);
            setError('Failed to handle pinch gesture');
          }
        });

      } catch (err) {
        alert(`Error initializing Hammer: ${err.message}`);
        setError('Failed to initialize touch handlers');
      }
    };

    initHammer();

    return () => {
      if (hammerInstance) {
        alert('Cleaning up Hammer instance');
        hammerInstance.destroy();
      }
    };
  }, [isClient, width, height]);

  // Rest of your component code remains the same...
  // (Mouse event handlers and render code)

  if (!isClient) {
    alert('Returning null - not client side');
    return null;
  }

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: '2px solid #ddd',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'rgba(255,0,0,0.1)',
          padding: '5px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
      <Draggable
        nodeRef={nodeRef}
        bounds="parent"
        position={position}
        onDrag={handleDrag}
        onStop={handleStop}
        disabled={isResizing}
      >
        {/* Rest of your JSX remains the same */}
      </Draggable>
    </div>
  );
};

export default DraggableImage;
