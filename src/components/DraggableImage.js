/* eslint-disable @next/next/no-img-element */
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';

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
    Swal.fire('Info', 'Client-side rendering initialized', 'info');
  }, []);

  // Initialize Hammer.js
  useEffect(() => {
    let hammerInstance = null;

    const initHammer = async () => {
      try {
        Swal.fire('Info', 'Attempting to initialize Hammer.js', 'info');
        Swal.fire({
          title: 'Checks',
          html: `
            <p>isClient: ${isClient}</p>
            <p>hasImageRef: ${!!imageRef.current}</p>
            <p>hasHammer: ${!!Hammer}</p>
          `,
          icon: 'info',
        });

        if (!isClient) {
          Swal.fire('Warning', 'Not client side yet', 'warning');
          return;
        }

        if (!imageRef.current) {
          Swal.fire('Warning', 'Image ref not available', 'warning');
          return;
        }

        if (!Hammer) {
          Swal.fire('Error', 'Hammer.js not loaded', 'error');
          return;
        }

        hammerInstance = new Hammer(imageRef.current);
        Swal.fire('Success', 'Hammer instance created', 'success');

        // Enable pinch with error handling
        try {
          hammerInstance.get('pinch').set({ enable: true });
          Swal.fire('Success', 'Pinch gesture enabled', 'success');
        } catch (err) {
          Swal.fire('Error', `Error enabling pinch: ${err.message}`, 'error');
          setError('Failed to enable pinch gesture');
        }

        hammerInstance.on('pinch', (e) => {
          try {
            const adjustmentFactor = 2;
            const widthDelta = e.scale > 1 ? adjustmentFactor : -adjustmentFactor;
            const heightDelta = e.scale > 1 ? adjustmentFactor : -adjustmentFactor;

            setImgWidth((prev) => Math.min(Math.max(100, prev + widthDelta), width));
            setImgHeight((prev) => Math.min(Math.max(100, prev + heightDelta), height));
          } catch (err) {
            Swal.fire('Error', `Error in pinch handler: ${err.message}`, 'error');
            setError('Failed to handle pinch gesture');
          }
        });

      } catch (err) {
        Swal.fire('Error', `Error initializing Hammer: ${err.message}`, 'error');
        setError('Failed to initialize touch handlers');
      }
    };

    initHammer();

    return () => {
      if (hammerInstance) {
        Swal.fire('Info', 'Cleaning up Hammer instance', 'info');
        hammerInstance.destroy();
      }
    };
  }, [isClient, width, height]);

  if (!isClient) {
    Swal.fire('Warning', 'Returning null - not client side', 'warning');
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
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'rgba(255,0,0,0.1)',
            padding: '5px',
            zIndex: 1000,
          }}
        >
          {error}
        </div>
      )}
      <Draggable
        nodeRef={nodeRef}
        bounds="parent"
        position={position}
        onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
        onStop={() => Swal.fire('Info', 'Drag operation completed', 'info')}
        disabled={isResizing}
      >
        <img
          ref={imageRef}
          src={uploadedImage}
          alt="Draggable"
          style={{
            width: `${imgWidth}px`,
            height: `${imgHeight}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        />
      </Draggable>
    </div>
  );
};

export default DraggableImage;
