/* eslint-disable @next/next/no-img-element */
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import useMouseTracker from '@/utils/mouseTracker';

const DraggableImage = ({ width, height, uploadedImage }) => {
  const nodeRef = React.useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imgWidth, setImgWidth] = useState(200);
  const [imgHeight, setImgHeight] = useState(200);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (isResizing) {
      const currentMousePos = { x: e.clientX, y: e.clientY };
      
      if (currentMousePos.x < mousePos.x) {
        // Moving Left - decrease both dimensions
        setImgWidth(prev => Math.max(100, prev - 10));
        setImgHeight(prev => Math.max(100, prev - 10));
      } else if (currentMousePos.x > mousePos.x) {
        // Moving Right - increase both dimensions
        setImgWidth(prev => Math.min(width, prev + 10));
        setImgHeight(prev => Math.min(height, prev + 10));
      }
      
      setMousePos(currentMousePos);
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isResizing, mousePos]);

  const handleDrag = (e, data) => {
    if (!isResizing) {
      setIsDragging(true);
      setPosition({ x: data.x, y: data.y });
    }
  };

  const handleStop = () => {
    setIsDragging(false);
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
    if (isResizing) {
      document.addEventListener('mouseup', handleIconMouseUp);
      return () => document.removeEventListener('mouseup', handleIconMouseUp);
    }
  }, [isResizing]);

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
        onStop={handleStop}
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
          <img
            src={uploadedImage || "https://ik.imagekit.io/c1jhxlxiy/plate-various-fruits-marble-background-high-quality-photo.jpg?updatedAt=1737178016814"}
            alt="Draggable Combo Pack"
            style={{
              width: '100%',
              height: '100%',
              userSelect: 'none',
              pointerEvents: isResizing ? 'none' : 'auto',
            }}
          />
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