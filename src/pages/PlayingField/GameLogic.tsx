import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import Card from "../../components/Card/Card";
import styles from "./PlayingField.module.scss";

interface CardType {
  id: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function GameLogic({ isGameStarted }: { isGameStarted: boolean }) {
  const {
    cardSets,
    gridSize,
    level,
    sampleOrUpload,
    currentScore,
    errors,
    errorLimit,
    maxScore,
    time,
    gamesPlayed,
    isGameOver,
    theme,
    setCurrentScore,
    setErrors,
    setProgress,
    setStartGame,
    setIsGameOver,
    setIsStartedTimer,
    setMaxScore,
    setTime,
    setGamesPlayed,
  } = useContext(AppContext)!;

  const loadUserImages = () => JSON.parse(localStorage.getItem("userImages") || "[]");

  const createCards = () => {
    const localStorageKey = `cards_${cardSets}`;
    const savedCards = localStorage.getItem(localStorageKey);
    if (savedCards) return JSON.parse(savedCards);

    const totalPairs = gridSize === 4 ? 8 : gridSize === 6 ? 18 : 42;
    const userImages = loadUserImages();
    const isEnoughImages = sampleOrUpload === "upload" && userImages.length >= totalPairs;

    const cardsArray: CardType[] = Array.from({ length: totalPairs }, (_, i) => ({
      id: `${i}-0`,
      image: isEnoughImages
        ? userImages[i % userImages.length]
        : `https://api.dicebear.com/6.x/${cardSets}/svg?seed=${Math.random().toString(36).substring(2, 15)}`,
      isFlipped: false,
      isMatched: false,
    }));

    localStorage.setItem(localStorageKey, JSON.stringify(cardsArray));
    return cardsArray;
  };

  const [cards, setCards] = useState<CardType[]>(createCards);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [previouslyFlippedPairs, setPreviouslyFlippedPairs] = useState<string[][]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const shuffleCards = (cardsArray: CardType[]) => {
    const doubledCards = [...cardsArray, ...cardsArray];

    const shuffled = doubledCards.map((card, index) => ({
      ...card,
      id: `${card.id.split("-")[0]}-${index}`,
    }));

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

  useEffect(() => {
    const localStorageKey = `cards_${cardSets}`;

    localStorage.removeItem(localStorageKey);

    setCards(shuffleCards(createCards()));
  }, [gridSize, cardSets]);

  const updateProgress = (matchedPairs: number) => {
    const totalPairs = cards.length / 2;
    setProgress((matchedPairs / totalPairs) * 100);
  };

  useEffect(() => {
    if (errorLimit === errors || cards.every((card) => card.isMatched)) {
      setTimeout(() => {
        setIsGameOver(true);
        setIsStartedTimer(false);
        setStartGame(false);
      });
    }
  }, [cards, errorLimit, errors, setStartGame, setIsGameOver, setIsStartedTimer]);

  const isRepeatAttempt = (pair: string[]) => {
    return previouslyFlippedPairs.some((prevPair) => prevPair[0] === pair[0] && prevPair[1] === pair[1]);
  };

  const handleCardClick = (id: string) => {
    if (!isGameStarted || flippedCards.length === 2 || isChecking) return;

    setCards((prevCards) => {
      const updatedCards = prevCards.map((card) => (card.id === id && !card.isMatched ? { ...card, isFlipped: !card.isFlipped } : card));

      const newFlippedCards = updatedCards.filter((card) => card.isFlipped && !card.isMatched);
      setFlippedCards(newFlippedCards.map((card) => card.id));

      const updateScore = (score: number) => {
        setCurrentScore(score);
        if (score > maxScore) {
          setMaxScore(score);
        }
      };

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
            updateScore(currentScore + { Easy: 5, Medium: 7, Hard: 10, "No Way": 15, Custom: 5 }[level]!);
            updateProgress(matchedPairs);
          }, 0);
        }
      }

      return updatedCards;
    });
  };

  const saveGameResults = () => {
    const time = sessionStorage.getItem("gameTimeLeft") || "0";
    const gameResults = {
      date: new Date().toLocaleString(),
      level: level,
      time: time,
      errors: errors,
      score: currentScore,
    };

    const previousResults = JSON.parse(sessionStorage.getItem("gameResults") || "[]");
    previousResults.push(gameResults);

    sessionStorage.setItem("gameResults", JSON.stringify(previousResults));
  };

  const resetGame = () => {
    saveGameResults();

    setTimeout(() => {
      localStorage.removeItem("cards");
      setCards(shuffleCards(createCards()));
      setIsGameOver(false);
      setPreviouslyFlippedPairs([]);
      setFlippedCards([]);
      setProgress(0);
      setCurrentScore(0);
      setTime(time);
      setStartGame(false);
      setIsStartedTimer(false);
      setGamesPlayed(gamesPlayed + 1);

      if (isGameOver) {
        setErrors(0);
      }
    }, 300);
  };

  return (
    <div className={styles.playingfield}>
      <div className={gridSize === 4 ? styles.grid4 : gridSize === 6 ? styles.grid6 : styles.grid8}>
        {cards.map((card) => (
          <Card key={card.id} id={card.id} image={card.image} isFlipped={card.isFlipped} isMatched={card.isMatched} onClick={handleCardClick} />
        ))}
      </div>

      {isGameOver && (
        <div className={`${styles.modal} ${theme === "Dark" ? styles.modal__darkMode : ""}`}>
          <div className={styles.modal__content}>
            <h2>
              {errorLimit === errors
                ? "Вы проиграли, у вас закончились попытки"
                : cards.every((card) => card.isMatched)
                ? `Поздравляем, вы угадали все пары! Ваш счёт: ${currentScore}`
                : "Вы проиграли, не успели угадать все пары"}
            </h2>
            <button onClick={resetGame}>Начать заново</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameLogic;
