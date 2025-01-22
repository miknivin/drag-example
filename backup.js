import { useState, useEffect } from 'react';

const useMouseTracker = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [quadrant, setQuadrant] = useState('');

  // Tolerance for center detection (adjust as needed)
  const centerTolerance = 50;

  useEffect(() => {
    // Update window size on mount and resize
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);

    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  useEffect(() => {
    // Track mouse position
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Determine quadrant or center
    const { x, y } = mousePosition;
    const { width, height } = windowSize;

    if (width && height) {
      const centerX = width / 2;
      const centerY = height / 2;

      const isInCenter =
        Math.abs(x - centerX) <= centerTolerance &&
        Math.abs(y - centerY) <= centerTolerance;

      if (isInCenter) {
        setQuadrant('Center');
      } else if (x > width / 2 && y < height / 2) {
        setQuadrant('Top Right');
      } else if (x > width / 2 && y > height / 2) {
        setQuadrant('Bottom Right');
      } else if (x < width / 2 && y < height / 2) {
        setQuadrant('Top Left');
      } else if (x < width / 2 && y > height / 2) {
        setQuadrant('Bottom Left');
      }
    }
  }, [mousePosition, windowSize]);

  return quadrant;
};

export default useMouseTracker;
