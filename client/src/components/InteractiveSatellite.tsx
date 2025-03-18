import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Department {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  color: number;
}

const departments: Department[] = [
  { 
    id: "power-system", 
    name: "Power System", 
    position: { x: -3, y: 0, z: 0 }, 
    color: 0x1E88E5 
  },
  { 
    id: "onboard-computer", 
    name: "On-Board Computer", 
    position: { x: 0, y: 0, z: 0 }, 
    color: 0x6A0DAD 
  },
  { 
    id: "communication-system", 
    name: "Communication System", 
    position: { x: 0, y: 2.5, z: 0 }, 
    color: 0xFFC107 
  },
  { 
    id: "adcs", 
    name: "Altitude Determination & Control", 
    position: { x: 0, y: -1, z: 1 }, 
    color: 0x4CAF50 
  },
  { 
    id: "thermal-control", 
    name: "Thermal Control System", 
    position: { x: 3, y: 0, z: 0 }, 
    color: 0xF44336 
  }
];

interface InteractiveSatelliteProps {
  onSelectDepartment: (department: string, name: string) => void;
}

const InteractiveSatellite = ({ onSelectDepartment }: InteractiveSatelliteProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
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
    
    // Create satellite body (main body - onboard computer)
    const bodyGeometry = new THREE.SphereGeometry(2, 32, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6A0DAD,
      metalness: 0.7,
      roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.userData = { department: "onboard-computer" };
    scene.add(body);
    
    // Create solar panels (power system)
    const leftPanelGeometry = new THREE.BoxGeometry(4, 0.1, 1);
    const leftPanelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1E88E5,
      metalness: 0.5,
      roughness: 0.2
    });
    const leftPanel = new THREE.Mesh(leftPanelGeometry, leftPanelMaterial);
    leftPanel.position.x = -3;
    leftPanel.userData = { department: "power-system" };
    scene.add(leftPanel);
    
    // Right panel (thermal control system)
    const rightPanelGeometry = new THREE.BoxGeometry(4, 0.1, 1);
    const rightPanelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xF44336,
      metalness: 0.5,
      roughness: 0.2
    });
    const rightPanel = new THREE.Mesh(rightPanelGeometry, rightPanelMaterial);
    rightPanel.position.x = 3;
    rightPanel.userData = { department: "thermal-control" };
    scene.add(rightPanel);
    
    // Create antenna (communication system)
    const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
    const antennaMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFC107,
      metalness: 0.8,
      roughness: 0.2
    });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.y = 2.5;
    antenna.userData = { department: "communication-system" };
    scene.add(antenna);
    
    // Create ADCS (cylinder at bottom)
    const adcsGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
    const adcsMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4CAF50,
      metalness: 0.6,
      roughness: 0.3
    });
    const adcs = new THREE.Mesh(adcsGeometry, adcsMaterial);
    adcs.position.y = -1;
    adcs.position.z = 1;
    adcs.userData = { department: "adcs" };
    scene.add(adcs);
    
    // Add text labels for each department
    const createLabel = (text: string, position: THREE.Vector3) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;
      
      canvas.width = 256;
      canvas.height = 128;
      
      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = 'Bold 20px Orbitron';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      
      sprite.position.copy(position);
      sprite.position.y += 1;
      sprite.scale.set(3, 1.5, 1);
      
      return sprite;
    };
    
    const labels: THREE.Sprite[] = [];
    
    departments.forEach(dept => {
      const pos = new THREE.Vector3(dept.position.x, dept.position.y, dept.position.z);
      const label = createLabel(dept.name, pos);
      if (label) {
        label.visible = true; // Make labels always visible
        scene.add(label);
        labels.push(label);
      }
    });
    
    // Position camera
    camera.position.z = 10;
    
    // Setup raycaster for mouse interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObjects([body, leftPanel, rightPanel, antenna, adcs]);
      
      // Always keep labels visible
      // No need to hide them
      
      // Reset all materials
      [body, leftPanel, rightPanel, antenna, adcs].forEach(part => {
        const originalDept = departments.find(d => d.id === part.userData.department);
        if (originalDept) {
          (part.material as THREE.MeshStandardMaterial).color.setHex(originalDept.color);
          (part.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
        }
      });
      
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const departmentId = intersectedObject.userData.department;
        
        setHoveredPart(departmentId);
        
        // Highlight the hovered part
        (intersectedObject.material as THREE.MeshStandardMaterial).emissive.setHex(0x333333);
        
        // Show label for hovered part
        const deptIndex = departments.findIndex(d => d.id === departmentId);
        if (deptIndex >= 0 && deptIndex < labels.length) {
          labels[deptIndex].visible = true;
        }
        
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredPart(null);
        document.body.style.cursor = 'default';
      }
    };
    
    // Click handler
    const handleMouseClick = () => {
      if (hoveredPart) {
        const deptName = departments.find(d => d.id === hoveredPart)?.name || '';
        onSelectDepartment(hoveredPart, deptName);
      }
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleMouseClick);
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Rotate the satellite slightly
      body.rotation.y += 0.002;
      leftPanel.rotation.y += 0.002;
      rightPanel.rotation.y += 0.002;
      antenna.rotation.y += 0.002;
      adcs.rotation.y += 0.002;
      
      labels.forEach(label => {
        label.quaternion.copy(camera.quaternion);
      });
      
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
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleMouseClick);
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectDepartment, hoveredPart]);
  
  return (
    <div ref={containerRef} className="w-full h-full" />
  );
};

export default InteractiveSatellite;
