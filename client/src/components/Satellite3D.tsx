import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Satellite3DProps {
  containerWidth?: number;
  containerHeight?: number;
}

const Satellite3D = ({ 
  containerWidth = 400, 
  containerHeight = 400 
}: Satellite3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = containerWidth;
    const height = containerHeight;
    
    // Create scene, camera and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Create satellite body (sphere)
    const bodyGeometry = new THREE.SphereGeometry(2, 32, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1E88E5,
      metalness: 0.7,
      roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    scene.add(body);
    
    // Create solar panels (boxes)
    const panelGeometry = new THREE.BoxGeometry(4, 0.1, 1);
    const panelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6A0DAD,
      metalness: 0.5,
      roughness: 0.2
    });
    
    // Left panel
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.x = -3;
    scene.add(leftPanel);
    
    // Right panel
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.x = 3;
    scene.add(rightPanel);
    
    // Create antenna (cylinder)
    const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
    const antennaMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFC107,
      metalness: 0.8,
      roughness: 0.2
    });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.y = 2.5;
    scene.add(antenna);
    
    // Position camera
    camera.position.z = 7;
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Rotate the satellite
      body.rotation.y += 0.005;
      leftPanel.rotation.y += 0.005;
      rightPanel.rotation.y += 0.005;
      antenna.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerWidth, containerHeight]);
  
  return (
    <div ref={containerRef} className="w-full h-full" />
  );
};

export default Satellite3D;
