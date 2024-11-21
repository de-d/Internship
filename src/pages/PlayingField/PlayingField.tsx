import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import style from "./PlayingField.module.scss";
import Header from "../../components/Header/Header";
import GameLogic from "./GameLogic";

export default function PlayingField() {
  const { startGame, isGameStarted } = useContext(AppContext)!;

  const handleStartClick = () => {
    startGame();
  };

  return (
    <div className={style.playingfield}>
      <div className={style.playingfield__container}>
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
