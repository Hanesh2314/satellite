import { useEffect, useRef } from "react";

const StarBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const starsContainer = containerRef.current;
    const numStars = 150;
    
    // Clear existing stars if any
    starsContainer.innerHTML = '';
    
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random size
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random twinkle delay
      star.style.animationDelay = `${Math.random() * 3}s`;
      
      starsContainer.appendChild(star);
    }
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0" />;
};

export default StarBackground;
