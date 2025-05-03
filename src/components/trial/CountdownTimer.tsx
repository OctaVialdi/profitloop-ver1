
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: Date | null;
  onExpired?: () => void;
}

export const CountdownTimer = ({ endDate, onExpired }: CountdownTimerProps) => {
  const [countdownString, setCountdownString] = useState<string>('');
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!endDate) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      
      if (diffTime <= 0) {
        setCountdownString('0 hari 00:00:00');
        setDaysLeft(0);
        setIsExpired(true);
        
        // Notify parent component when countdown expires
        if (onExpired) onExpired();
        return;
      }
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      
      // Format as "X hari HH:MM:SS"
      const formattedTime = `${days} hari ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setCountdownString(formattedTime);
      setDaysLeft(days);
    };
    
    // Initial update
    updateCountdown();
    
    // Set interval for countdown
    const interval = setInterval(updateCountdown, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [endDate, onExpired]);
  
  return { countdownString, daysLeft, isExpired };
};

export default CountdownTimer;
