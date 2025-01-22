import { useState, useCallback } from 'react';

export const useBackgroundRemover = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeBackground = useCallback(async (input, threshold = 240) => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert File to URL if input is a File object
      const imageUrl = input instanceof File 
        ? URL.createObjectURL(input)
        : input;
      
      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Process each pixel
          for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (brightness > threshold) {
              data[i + 3] = 0; // Set alpha to 0
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          // Cleanup URL if input was a File
          if (input instanceof File) {
            URL.revokeObjectURL(imageUrl);
          }
          
          resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = (e) => {
          if (input instanceof File) {
            URL.revokeObjectURL(imageUrl);
          }
          reject(new Error('Failed to load image'));
        };
        
        img.src = imageUrl;
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { removeBackground, loading, error };
};