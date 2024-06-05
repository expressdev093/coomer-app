import {useState, useEffect} from 'react';
export const useTimer = (): [
  number,
  boolean,
  () => void,
  () => void,
  () => void,
] => {
  const [seconds, setSeconds] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const startTimer = () => {
    setIsActive(true);
    setIsStarted(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setSeconds(30);
    setIsActive(false);
    setIsStarted(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return [seconds, isStarted, startTimer, stopTimer, resetTimer];
};
