import { useState, useEffect } from 'react';

const useMouseTracker = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseDirection, setMouseDirection] = useState('');

  useEffect(() => {
    // Track mouse position
    const handleMouseMove = (event) => {
      const newMousePosition = { x: event.clientX, y: event.clientY };

      // Compare the current mouse position with the previous one to detect movement
      if (newMousePosition.x > mousePosition.x) {
        setMouseDirection('Right');
      } else if (newMousePosition.x < mousePosition.x) {
        setMouseDirection('Left');
      }

      setMousePosition(newMousePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mousePosition]); // Run the effect whenever the mouse position changes

  return mouseDirection;
};

export default useMouseTracker;
