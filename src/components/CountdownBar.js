import React, { useState, useEffect } from 'react';

const CountdownBar = ({ time, date }) => {
  const newDate = date.split('-').reverse().join('-');
  const targetDateTime = new Date(`${newDate}T${time}`);
  const currentTime = new Date();

  const [progress, setProgress] = useState(100);
  const [timeRemainingText, setTimeRemainingText] = useState('');
  const exponent = 0.0001;
  useEffect(() => {
    const totalTime = targetDateTime - currentTime;
    const interval = setInterval(() => {
      const remaining = Math.max(targetDateTime - new Date(), 0);
      const timeRemaining = Math.max(remaining, 0);
      const euler = Math.E;
      const k = 0.0000000003;
      let x_left_0_1 =  1-Math.pow(euler, -k * timeRemaining);


      setProgress(100*x_left_0_1);

      const secondsRemaining = Math.floor(timeRemaining / 1000);
      const days = Math.floor(secondsRemaining / 86400);
      const hours = Math.floor(secondsRemaining / 3600);
      const minutes = Math.floor((secondsRemaining % 3600) / 60);
      const seconds = secondsRemaining % 60;

      setTimeRemainingText(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateTime, currentTime, exponent]);

  return (
    <div className="countdown-bar">
      <div className="bar-container">
        <div className="bar" style={{ width: `${100-progress}%` }}>
          <div className="progress-movement"></div>
          <div className="progress-text">{timeRemainingText}</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownBar;
