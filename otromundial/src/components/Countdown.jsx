import { useState, useEffect } from 'react';
import Counter from './Counter';

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference > 0) {
        return Math.floor(difference / (1000 * 60 * 60 * 24));
      }
      return 0;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000 * 60 * 60); // Check every hour, since we only show days

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center justify-center mt-6 mb-8 p-6 border border-[#FF00FF]/30 bg-black/40 backdrop-blur-md rounded-lg">
      <div className="font-barlow text-lg tracking-[0.2em] text-[#FF00FF] uppercase mb-4 text-center">
        Days left to back the project
      </div>
      <div className="flex items-center gap-4">
        <Counter
          value={timeLeft}
          places={[10, 1]}
          fontSize={72}
          padding={0}
          gap={4}
          textColor="#FFD700"
          fontWeight={900}
          gradientFrom="rgba(0,0,0,0.8)"
          gradientTo="rgba(0,0,0,0)"
          gradientHeight={12}
        />
        <span className="font-bebas text-5xl text-white/50 tracking-widest mt-2">DAYS</span>
      </div>
    </div>
  );
}
