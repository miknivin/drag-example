/* eslint-disable @next/next/no-img-element */
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useDrag, usePinch } from '@use-gesture/react';
import { animated } from '@react-spring/web';

const DraggableImage = ({ width, height, uploadedImage }) => {
  const [imgWidth, setImgWidth] = useState(200);
  const [imgHeight, setImgHeight] = useState(200);

  const bindDrag = useDrag((state) => {
    // Handle dragging logic if needed
    console.log("Dragging", state.offset);
  });

  const bindPinch = usePinch((state) => {
    // Handle pinch zoom logic
    const { offset: [scale], movement: [dx, dy] } = state;
    const newWidth = Math.max(100, imgWidth * scale); // Prevent zooming out too far
    const newHeight = Math.max(100, imgHeight * scale); // Prevent zooming out too far
    setImgWidth(newWidth);
    setImgHeight(newHeight);
  });

  return (
    <div
      {...bindDrag()}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: '2px solid #ddd',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <animated.div
        {...bindPinch()}
        style={{
          width: `${imgWidth}px`,
          height: `${imgHeight}px`,
          position: 'relative',
          cursor: 'grab',
          transition: 'width 0.1s, height 0.1s',
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
            backgroundColor: 'transparent',
          }}
        >
          <FontAwesomeIcon
            icon={faUpRightAndDownLeftFromCenter}
            style={{ transform: 'rotate(90deg)' }}
          />
        </div>
      </animated.div>
    </div>
  );
};

export default DraggableImage;
