
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  duration?: number;
  particleCount?: number;
}

export const Confetti = ({ 
  duration = 3000, 
  particleCount = 100 
}: ConfettiProps) => {
  useEffect(() => {
    // Launch confetti when component mounts
    const end = Date.now() + duration;
    
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    
    // First burst
    confetti({
      particleCount,
      spread: 70,
      origin: { y: 0.6 },
      colors
    });
    
    // Continuous smaller bursts until duration ends
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      
      confetti({
        particleCount: particleCount / 3,
        angle: Math.random() * 120 + 30,
        spread: 50,
        origin: { 
          x: Math.random(), 
          y: Math.random() - 0.2 
        },
        colors
      });
    }, 250);
    
    return () => clearInterval(interval);
  }, [duration, particleCount]);
  
  return null; // No actual DOM rendering
};
