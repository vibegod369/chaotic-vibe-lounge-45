
import { useEffect, useState } from 'react';
import GlitchText from './GlitchText';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-vibe-neon">
        <GlitchText text="Launch Countdown" intensity="low" />
      </h3>
      
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(timeLeft).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center">
            <div className="relative w-full aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-vibe-dark border-2 border-vibe-neon/40 rounded-lg"></div>
              <div className="absolute inset-0 bg-vibe-neon/5 rounded-lg animate-pulse-subtle"></div>
              <span className="relative z-10 text-4xl sm:text-5xl font-glitch font-bold text-vibe-neon animate-pulse-neon">
                {value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-vibe-neon/70 font-code text-sm uppercase">
              {key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
