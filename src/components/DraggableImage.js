/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use-client;'
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import Draggable from 'react-draggable';
import { useGesture } from '@use-gesture/react';

const DraggableImage = ({ width, height, uploadedImage }) => {
  const nodeRef = useRef(null);
  const secondRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useGesture(
    {
      onPinchStart: ({ event }) => {
        console.log('Pinch started');
      },
      onPinch: ({ offset: [distance], da: [deltaAngle], event }) => {
        event.preventDefault(); // Prevents default zoom behavior

        // Update scale within bounds
        setScale(Math.min(Math.max(0.5, distance), 3));
      },
      onPinchEnd: ({ event }) => {
        console.log('Pinch End:', {
          event: event.type,
          finalScale: scale,
        });
      },
    },
    {
      target: nodeRef,
      eventOptions: { passive: false },
      pinch: {
        from: scale,
        scaleBounds: { min: 0.5, max: 3 },
        rubberband: true,
      },
    }
  );

  useGesture(
    {
      onDrag: ({ movement: [x, y], memo = { angle: 0 } }) => {
        if (!isResizing) {
          setIsRotating(true)
          // Only update the rotation if resizing is not active
          const radianAngle = Math.atan2(y, x); // Calculate angle in radians
          const degreeAngle = (radianAngle * 180) / Math.PI; // Convert to degrees
          setAngle(degreeAngle.toFixed(2)); // Update angle state
        }
      },
      onDragEnd: () => {
        setIsRotating(false); 
      },
    },
    { target: secondRef }
  );

  const handleMouseMove = (e) => {
    if (isResizing) {
      const currentMousePos = { x: e.clientX, y: e.clientY };

      if (currentMousePos.x < mousePos.x) {
        setScale((prev) => Math.max(0.5, prev - 0.1));
      } else if (currentMousePos.x > mousePos.x) {
        setScale((prev) => Math.min(3, prev + 0.1));
      }

      setMousePos(currentMousePos);
    }
  };

  const handleIconMouseDown = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleIconMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (!isClient) return;

    if (isResizing && !isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleIconMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleIconMouseUp);
      };
    }
  }, [isResizing, mousePos, isClient]);

  const handleDrag = (e, data) => {
    if (!isResizing && !isDragging) {
      setPosition({ x: data.x, y: data.y });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden border-2 border-gray-200"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Draggable
        nodeRef={nodeRef}
        bounds="parent"
        onDrag={handleDrag}
        disabled={isResizing || isRotating}
        style={{width:"fit-content",height:"fit-content"}}
      >
        <div
          ref={nodeRef}
          style={{
            width: '200px',
            height: '200px',
            position: 'relative',
            cursor: isResizing ? 'se-resize' : 'grab',
            touchAction: 'none',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <div className="w-full h-full touch-none">
              <img
                src={uploadedImage || '/api/placeholder/200/200'}
                alt="Draggable Content"
                className="w-full h-full select-none"
                style={{
                  transform: `rotate(${angle}deg)`,
                  pointerEvents: isResizing ? 'none' : 'auto',
                }}
              />
            </div>
            <div
              className="absolute bottom-0.5 right-2.5 p-1.5 rounded-full cursor-se-resize"
              style={{
                mixBlendMode: 'difference',
                backgroundColor: isResizing ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
              }}
              onMouseDown={handleIconMouseDown}
            >
              <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className="transform rotate-90" />
            </div>
            <div
            style={{
              position:"absolute",
              bottom:0,
              left:"50%",
              touchAction: 'none',
            }}
            ref={secondRef}
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </div>
          </div>
          
        </div>
      </Draggable>
    </div>
  );
};

export default DraggableImage;
