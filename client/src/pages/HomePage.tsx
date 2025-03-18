import { useCallback, useState, useEffect } from "react";
import { useLocation } from "wouter";
import Satellite3D from "@/components/Satellite3D";
import AboutUsEditor from "@/components/AboutUsEditor";
import StarBackground from "@/components/StarBackground";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HomePage = () => {
  const [, navigate] = useLocation();
  const [glowIntensity, setGlowIntensity] = useState(1);
  
  // Animation effect for the button glow
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => prev === 1 ? 1.5 : 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinTeam = useCallback(() => {
    navigate("/confirmation");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-stellar-dark text-white relative">
      <StarBackground />
      
      <div className="container mx-auto px-4 py-10 z-10 relative">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              RESEARCH SATELLITE TEAM
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Join our mission to design and build cutting-edge satellite technology
            </p>
          </div>

          <div className="relative w-full flex items-center justify-center mb-8">
            <div className="mx-auto">
              <Satellite3D containerWidth={500} containerHeight={500} />
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            animate={{ 
              boxShadow: `0 0 ${20 * glowIntensity}px ${8 * glowIntensity}px rgba(0, 150, 255, 0.5)` 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mb-20"
          >
            <Button
              onClick={handleJoinTeam}
              className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 px-10 rounded-full text-xl overflow-hidden"
              size="lg"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 opacity-30"
                animate={{ 
                  x: ["0%", "100%", "0%"],
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                }}
              />
              <motion.span 
                className="relative z-10 flex items-center"
                animate={{ textShadow: `0 0 ${8 * glowIntensity}px rgba(255, 255, 255, 0.8)` }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                Join the Team
                <motion.span 
                  className="ml-2"
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  🚀
                </motion.span>
              </motion.span>
            </Button>
          </motion.div>
          
          <div className="w-full max-w-3xl mb-16">
            <AboutUsEditor isAdmin={false} />
          </div>
        </div>
      </div>
      
      <div className="fixed top-4 right-4 z-20">
        <Button variant="ghost" asChild className="text-gray-400 hover:text-white">
          <a href="/admin">Admin Panel</a>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;