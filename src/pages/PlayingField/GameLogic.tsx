import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import Card from "../../components/Card/Card";
import styles from "./PlayingField.module.scss";

const generateRandomSeed = () => Math.random().toString(36).substring(2, 15);

function GameLogic({ isGameStarted }: { isGameStarted: boolean }) {
  const { currentScore, errors, gridSize, isGameOver, setCurrentScore, setErrors, setProgress, setIsGameOver, incrementGamesPlayed } =
    useContext(AppContext)!;

  const createCards = () => {
    const cardsArray = [];
    const totalPairs = gridSize === 4 ? 8 : gridSize === 6 ? 18 : 0;
    for (let i = 0; i < totalPairs; i++) {
      const seed = generateRandomSeed();
      cardsArray.push({
        id: `${i}-0`,
        image: `https://api.dicebear.com/6.x/notionists/svg?seed=${seed}`,
        isFlipped: false,
        isMatched: false,
      });
    }
    return cardsArray;
  };

  const [cards, setCards] = useState(createCards);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [previouslyFlippedPairs, setPreviouslyFlippedPairs] = useState<string[][]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const shuffleCards = (cardsArray: { id: string; image: string; isFlipped: boolean; isMatched: boolean }[]) => {
    const doubledCards = [...cardsArray, ...cardsArray];

    const shuffled = doubledCards.map((card, index) => ({
      ...card,
      id: `${card.id.split("-")[0]}-${index}`,
    }));

    return shuffled.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setCards(shuffleCards(createCards()));
  }, [gridSize]);

  const checkGameOver = (cardsArray: { isMatched: boolean }[]) => {
    return cardsArray.every((card) => card.isMatched);
  };

  const updateProgress = (matchedPairs: number) => {
    const totalPairs = cards.length / 2;
    setProgress((matchedPairs / totalPairs) * 100);
  };

  useEffect(() => {
    if (checkGameOver(cards)) {
      setTimeout(() => {
        setIsGameOver(true);
      }, 1000);
    }
  }, [cards]);

  const handleCardClick = (id: string) => {
    if (!isGameStarted || flippedCards.length === 2 || isChecking) return;

    setCards((prevCards) => {
      const updatedCards = prevCards.map((card) => (card.id === id && !card.isMatched ? { ...card, isFlipped: !card.isFlipped } : card));

      const newFlippedCards = updatedCards.filter((card) => card.isFlipped && !card.isMatched);
      setFlippedCards(newFlippedCards.map((card) => card.id));

      if (newFlippedCards.length === 2) {
        const [card1, card2] = newFlippedCards;
        const pair = [card1.id, card2.id].sort();

        setIsChecking(true);

        if (card1.image !== card2.image) {
          setTimeout(() => {
            setCards((prev) => prev.map((card) => (card.id === card1.id || card.id === card2.id ? { ...card, isFlipped: false } : card)));
            setFlippedCards([]);
            setIsChecking(false);

            if (isRepeatAttempt(pair)) {
              if (currentScore > 0) {
                setCurrentScore(currentScore - 1);
              }
              setErrors(errors + 1);
            } else {
              setPreviouslyFlippedPairs((prev) => [...prev, pair]);
            }
          }, 1000);
        } else {
          setTimeout(() => {
            setCards((prev) => prev.map((card) => (card.id === card1.id || card.id === card2.id ? { ...card, isMatched: true } : card)));
            setFlippedCards([]);
            setIsChecking(false);

            const matchedPairs = cards.filter((card) => card.isMatched).length / 2 + 1;
            setCurrentScore(currentScore + 5);
            updateProgress(matchedPairs);
          }, 0);
        }
      }

      return updatedCards;
    });
  };

  const isRepeatAttempt = (pair: string[]) => {
    return previouslyFlippedPairs.some((prevPair) => prevPair[0] === pair[0] && prevPair[1] === pair[1]);
  };

  const resetGame = () => {
    setCards(shuffleCards(createCards()));
    setIsGameOver(false);
    setPreviouslyFlippedPairs([]);
    setFlippedCards([]);
    setProgress(0);
    setCurrentScore(0);
    setErrors(0);
    incrementGamesPlayed();
  };

  return (
    <div className={styles.playingfield}>
      <div className={gridSize === 4 ? styles.playingfield__grid__4 : styles.playingfield__grid__6}>
        {cards.map((card) => (
          <Card key={card.id} id={card.id} image={card.image} isFlipped={card.isFlipped} isMatched={card.isMatched} onClick={handleCardClick} />
        ))}
      </div>

      {errors === 5 && (
        <div className={styles.modal}>
          <div className={styles.modal__content}>
            <h2>Вы проиграли, у вас закончились попытки</h2>
            <button onClick={resetGame}>Начать заново</button>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className={styles.modal}>
          <div className={styles.modal__content}>
            <h2>{cards.every((card) => card.isMatched) ? "Поздравляем, вы угадали все пары" : "Вы проиграли, не успели угадать все пары"}</h2>
            <button onClick={resetGame}>Начать заново</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameLogic;
