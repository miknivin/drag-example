'use client';
import FileUpload from '@/components/FileUpload';
import React from 'react';

const Home = () => {


  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Upload Your Bag Image</h1>
    <FileUpload />
  </div>
  );
};

export default Home;
