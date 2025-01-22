/* eslint-disable @next/next/no-img-element */
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { usePinch } from '@use-gesture/react';

const DraggableImage = ({ width, height, uploadedImage }) => {
  const nodeRef = useRef(null);
  const imageRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imgWidth, setImgWidth] = useState(200);
  const [imgHeight, setImgHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pinch gesture handler using @use-gesture/react
  usePinch(
    ({ offset: [scale] }) => {
      const adjustmentFactor = 10 * (scale - 1);
      setImgWidth((prev) => Math.min(Math.max(100, prev + adjustmentFactor), width));
      setImgHeight((prev) => Math.min(Math.max(100, prev + adjustmentFactor), height));
    },
    {
      target: imageRef,
      eventOptions: { passive: false },
    }
  );

  // Mouse event handlers for resizing
  const handleMouseMove = (e) => {
    if (isResizing) {
      const currentMousePos = { x: e.clientX, y: e.clientY };

      if (currentMousePos.x < mousePos.x) {
        setImgWidth((prev) => Math.max(100, prev - 10));
        setImgHeight((prev) => Math.max(100, prev - 10));
      } else if (currentMousePos.x > mousePos.x) {
        setImgWidth((prev) => Math.min(width, prev + 10));
        setImgHeight((prev) => Math.min(height, prev + 10));
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

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleIconMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleIconMouseUp);
      };
    }
  }, [isResizing, mousePos, isClient]);

  const handleDrag = (e, data) => {
    if (!isResizing) {
      setPosition({ x: data.x, y: data.y });
    }
  };

  if (!isClient) {
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
      <Draggable
        nodeRef={nodeRef}
        bounds="parent"
        position={position}
        onDrag={handleDrag}
        disabled={isResizing}
      >
        <div
          ref={nodeRef}
          style={{
            width: `${imgWidth}px`,
            height: `${imgHeight}px`,
            cursor: isResizing ? 'ew-resize' : 'grab',
            position: 'relative',
            transition: 'width 0.1s, height 0.1s',
          }}
        >
          <div
            ref={imageRef}
            style={{
              width: '100%',
              height: '100%',
              touchAction: 'none',
            }}
          >
            <img
              src={
                uploadedImage ||
                'https://ik.imagekit.io/c1jhxlxiy/plate-various-fruits-marble-background-high-quality-photo.jpg?updatedAt=1737178016814'
              }
              alt="Draggable Combo Pack"
              style={{
                width: '100%',
                height: '100%',
                userSelect: 'none',
                pointerEvents: isResizing ? 'none' : 'auto',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '2px',
              right: '10px',
              padding: '5px',
              mixBlendMode: 'difference',
              borderRadius: '50%',
              cursor: 'ew-resize',
              backgroundColor: isResizing ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
            }}
            onMouseDown={handleIconMouseDown}
          >
            <FontAwesomeIcon
              icon={faUpRightAndDownLeftFromCenter}
              style={{ transform: 'rotate(90deg)' }}
            />
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default DraggableImage;
