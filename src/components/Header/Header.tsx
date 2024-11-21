import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Timer from "../Timer/Timer";
import style from "./Header.module.scss";

export default function Header() {
  const appContext = useContext(AppContext);
  const { gamesPlayed, maxScore, currentScore, errors, progress, level, resetSessionData, setIsGameOver } = appContext!;

  return (
    <div className={style.header}>
      <div className={style.header__left}>
        <div className={style.header__score_max}>
          <span>Макс. счёт:</span>
          <span>{maxScore}</span>
        </div>
        <div className={style.header__score_current}>
          <span>Тек. счёт:</span>
          <span>{currentScore}</span>
        </div>
      </div>
      <div className={style.header__center}>
        <div className={style.header__all_games}>
          <span>Всего игр:</span>
          <span>{gamesPlayed}</span>
        </div>
        <div className={style.header__timer_level}>
          <span>{level}</span>
          <Timer
            level={level}
            onTimeOver={() => {
              resetSessionData();
              setIsGameOver(true);
            }}
          />
        </div>
      </div>
      <div className={style.header__right}>
        <div className={style.header__errors}>
          <span>Ошибки:</span>
          <span>{errors}</span>
        </div>
        <div className={style.header__progress}>
          <span>Прогресс:</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
