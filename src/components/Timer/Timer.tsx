import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import style from "../Header/Header.module.scss";

interface TimerProps {
  level: string;
  onTimeOver: () => void;
}

export default function Timer({ level, onTimeOver }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerEnd, setTimerEnd] = useState<boolean>(false);
  const appContext = useContext(AppContext);
  const { gridSize, isStartedTimer } = appContext!;

  useEffect(() => {
    if (!isStartedTimer || timerEnd) return;

    const levelTimes: Record<string, Record<number, number>> = {
      easy: { 4: 60, 6: 180 },
      medium: { 4: 45, 6: 120 },
      hard: { 4: 30, 6: 90 },
    };

    const selectedTime = levelTimes[level]?.[gridSize] || 120;

    setTimeLeft(selectedTime);
    setIsTimerRunning(true);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          setTimerEnd(true);
          onTimeOver();
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStartedTimer, level, gridSize, onTimeOver, isTimerRunning, timerEnd]);

  return (
    <div>
      <div className={style.header__timer_level}>
        <span>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
