/* eslint-disable @next/next/no-img-element */
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { usePinch } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';

const DraggableImage = ({ width, height, uploadedImage }) => {
  const nodeRef = useRef(null);
  const imageRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  // Spring values for smooth scaling and rotation
  const [{ scale, rotate }, api] = useSpring(() => ({
    scale: 1,
    rotate: 0,
    config: { mass: 1, tension: 170, friction: 26 },
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pinch gesture handler using @use-gesture/react
  usePinch(
    ({ offset: [scale], movement: [, , angleDelta] }) => {
      api.start({ scale, rotate: rotate.get() + angleDelta });
    },
    {
      target: imageRef,
      eventOptions: { passive: false },
      pinch: { scaleBounds: { min: 0.5, max: 3 } }, // Limit scale range
    }
  );

  // Mouse event handlers for resizing
  const handleMouseMove = (e) => {
    if (isResizing) {
      const currentMousePos = { x: e.clientX, y: e.clientY };

      if (currentMousePos.x < mousePos.x) {
        api.start({ scale: Math.max(0.5, scale.get() - 0.1) });
      } else if (currentMousePos.x > mousePos.x) {
        api.start({ scale: Math.min(3, scale.get() + 0.1) });
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
        <animated.div
          ref={nodeRef}
          style={{
            width: '200px', // Base width
            height: '200px', // Base height
            cursor: isResizing ? 'se-resize' : 'grab',
            position: 'relative',
            transform: scale.to((s) => `scale(${s}) rotate(${rotate.get()}deg)`),
            touchAction: 'none',
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
              cursor: 'se-resize',
              backgroundColor: isResizing ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
            }}
            onMouseDown={handleIconMouseDown}
          >
            <FontAwesomeIcon
              icon={faUpRightAndDownLeftFromCenter}
              style={{ transform: 'rotate(90deg)' }}
            />
          </div>
        </animated.div>
      </Draggable>
    </div>
  );
};

export default DraggableImage;