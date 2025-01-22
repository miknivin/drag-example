/* eslint-disable react-hooks/rules-of-hooks */
// pages/index.js
'use client';
import DraggableImage from '@/components/DraggableImage';
import useMouseTracker from '@/utils/mouseTracker';
import React, { useEffect, useState } from 'react';

const page = () => {
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    // Retrieve the image from localStorage
    const imageData = localStorage.getItem('uploadedImage');
    if (imageData) {
      setUploadedImage(imageData);
    }
  }, []);

  const parentStyle = {
    position: 'relative',
    width: '400px',
    height: '400px',
    border: '2px solid red',
    overflow: 'hidden',
    margin: '0 auto',
    marginTop: '50px',
    backgroundImage: 'url(https://ik.imagekit.io/c1jhxlxiy/prod.jpg?updatedAt=1737052433288)',
    backgroundSize: 'cover', // Ensures the image covers the entire parent
    backgroundPosition: 'center', // Centers the background image
    backgroundRepeat: 'no-repeat', // Prevents the image from repeating
  };

  const quadrant = useMouseTracker();

  useEffect(() => {
    if (quadrant) {
    //  console.log(`Mouse moved to ${quadrant}`);
    }
  }, [quadrant]);

  return (
    <div style={parentStyle}>
      <DraggableImage width={400} height={400} uploadedImage={uploadedImage} />
    </div>
  );
};

export default page;
