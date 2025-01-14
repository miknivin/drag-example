/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import Draggable from 'react-draggable';

const DraggableImage = ({ width, height }) => {
  const nodeRef = React.useRef(null);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: '2px solid #ddd',
        position: 'relative',
        overflow: 'hidden', // Ensures the image doesn't go out of bounds
      }}
    >
      <Draggable
        nodeRef={nodeRef}
        bounds="parent" // Restricts movement within the parent container
      >
        <div
          ref={nodeRef}
          style={{
            width: '100px',
            height: '100px',
            position: 'absolute',
          }}
        >
          <img
            src="https://ik.imagekit.io/c1jhxlxiy/combo%20pack.jpg?updatedAt=1722794852197"
            alt="Draggable Combo Pack"
            style={{
              width: '100px',
              height: '100px',
            }}
          />
        </div>
      </Draggable>
    </div>
  );
};

export default DraggableImage;
