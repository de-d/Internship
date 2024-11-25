import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import style from "./PlayingField.module.scss";
import Header from "../../components/Header/Header";
import GameLogic from "./GameLogic";

export default function PlayingField() {
  const { isGameStarted, setStartGame } = useContext(AppContext)!;
  const navigate = useNavigate();

  const handleStartClick = () => {
    setStartGame(true);
  };

  return (
    <div className={style.playingfield}>
      <div className={style.playingfield__container}>
        <div className={style.playingfield__route}>
          <button className={style.playingfield__route__button} onClick={() => navigate("/settings")}>
            Настройки
          </button>
          <button className={style.playingfield__route__button} onClick={() => navigate("/results")}>
            Результаты
          </button>
        </div>
        <div className={style.playingfield__header}>
          <Header />
        </div>
        <GameLogic isGameStarted={isGameStarted} />
        {!isGameStarted && (
          <button className={style.playingfield__button} onClick={handleStartClick}>
            Начать игру
          </button>
        )}
      </div>
    </div>
  );
}
