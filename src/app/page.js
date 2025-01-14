'use client';
import { Draggable } from '@/components/Draggable';
import DraggableImage from '@/components/DraggableImage';
import React from 'react';

const Home = () => {
  const parentStyle = {
    position: 'relative',
    width: '800px',
    height: '800px',
    border: '2px solid red',
    overflow: 'hidden',
    margin: '0 auto',
    marginTop: '50px',
  };

  return (
    <div style={parentStyle}>
      <DraggableImage width={800} height={800} />
      <Draggable/>
    </div>
  );
};

export default Home;
