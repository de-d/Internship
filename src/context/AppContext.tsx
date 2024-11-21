import React, { createContext, useState, useEffect } from "react";

interface AppContextType {
  gamesPlayed: number;
  maxScore: number;
  currentScore: number;
  errors: number;
  gridSize: number;
  progress: number;
  level: string;
  isGameStarted: boolean;
  isGameOver: boolean;
  isStartedTimer: boolean;
  setCurrentScore: (score: number) => void;
  incrementGamesPlayed: () => void;
  resetSessionData: () => void;
  setErrors: (error: number) => void;
  setGridSize: (size: number) => void;
  setProgress: (progress: number) => void;
  setLevel: (level: string) => void;
  setIsGameOver: (isGameOver: boolean) => void;
  startGame: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [gamesPlayed, setGamesPlayed] = useState<number>(() => {
    const saved = localStorage.getItem("gamesPlayed");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [level, setLevel] = useState<string>(() => {
    const saved = localStorage.getItem("level");
    return saved ? saved : "easy";
  });

  const [maxScore, setMaxScore] = useState<number>(() => {
    const saved = localStorage.getItem("maxScore");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [gridSize, setGridSize] = useState<number>(() => {
    const saved = localStorage.getItem("gridSize");
    return saved ? parseInt(saved, 0) : 4;
  });

  const [currentScore, setCurrentScore] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStartedTimer, setIsStartedTimer] = useState(false);

  useEffect(() => {
    localStorage.setItem("gamesPlayed", gamesPlayed.toString());
    localStorage.setItem("maxScore", maxScore.toString());
    localStorage.setItem("gridSize", gridSize.toString());
    localStorage.setItem("level", level);
  }, [gamesPlayed, maxScore, gridSize, level]);

  const startGame = () => {
    setIsGameStarted(true);
    setIsStartedTimer(true);
  };

  const updateScore = (score: number) => {
    setCurrentScore(score);
    if (score > maxScore) {
      setMaxScore(score);
    }
  };

  const incrementGamesPlayed = () => {
    setGamesPlayed(gamesPlayed + 1);
    setCurrentScore(0);
    setErrors(0);
  };

  const resetSessionData = () => {
    setGamesPlayed(0);
    setCurrentScore(0);
    setErrors(0);
    localStorage.setItem("gamesPlayed", "0");
  };

  const contextValue = {
    gamesPlayed,
    maxScore,
    currentScore,
    errors,
    gridSize,
    progress,
    level,
    isGameStarted,
    isGameOver,
    isStartedTimer,
    startGame,
    setCurrentScore: updateScore,
    incrementGamesPlayed,
    resetSessionData,
    setErrors,
    setGridSize,
    setProgress,
    setLevel,
    setIsGameOver,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
