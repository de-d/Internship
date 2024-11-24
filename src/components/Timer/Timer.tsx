import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import style from "../Header/Header.module.scss";

interface TimerProps {
  onTimeOver: () => void;
}

export default function Timer({ onTimeOver }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { time, isGameStarted, isGameOver, setStartGame, setIsStartedTimer } = useContext(AppContext)!;

  useEffect(() => {
    setTimeLeft(time);
  }, [time]);

  useEffect(() => {
    if (!isGameStarted || isGameOver) {
      setTimeLeft(time);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          setStartGame(false);
          setIsStartedTimer(false);
          onTimeOver();
          return 0;
        }
      });

      if (isGameOver) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isGameStarted, isGameOver, time, onTimeOver, setStartGame, setIsStartedTimer]);

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
