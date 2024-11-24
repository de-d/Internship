import { createContext, useState, useEffect } from "react";

interface AppContextType {
  isGameStarted: boolean;
  isGameOver: boolean;
  nickname: string;
  level: string;
  gridSize: number;
  time: number;
  isStartedTimer: boolean;
  sampleOrUpload: string;
  cardSets: string;
  theme: string;
  maxScore: number;
  currentScore: number;
  gamesPlayed: number;
  errors: number;
  errorLimit: number;
  progress: number;

  setStartGame: (isGameStarted: boolean) => void;
  setIsGameOver: (isGameOver: boolean) => void;
  setNickname: (nickname: string) => void;
  setLevel: (level: string) => void;
  setGridSize: (gridSize: number) => void;
  setTime: (time: number) => void;
  setIsStartedTimer: (isStartedTimer: boolean) => void;
  setSampleOrUpload: (sampleOrUpload: string) => void;
  setCardSets: (cardSets: string) => void;
  setTheme: (theme: string) => void;
  setMaxScore: (maxScore: number) => void;
  setCurrentScore: (currentScore: number) => void;
  setGamesPlayed: (gamesPlayed: number) => void;
  setErrors: (errors: number) => void;
  setErrorLimit: (errorLimit: number) => void;
  setProgress: (progress: number) => void;
  resetSessionData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(() => {
    const savedSettings = JSON.parse(localStorage.getItem("appSettings") || "{}");
    return {
      gridSize: savedSettings.gridSize || 4,
      errorLimit: savedSettings.errorLimit || 3,
      level: savedSettings.level || "Custom",
      nickname: savedSettings.nickname || "Player",
      cardSets: savedSettings.cardSets || "notionists",
      maxScore: savedSettings.maxScore || 0,
      theme: savedSettings.theme,
    };
  });

  const [sessionData, setSessionData] = useState(() => {
    const savedSession = JSON.parse(sessionStorage.getItem("sessionData") || "{}");
    return {
      gamesPlayed: savedSession.gamesPlayed || 0,
      currentScore: 0,
      progress: 0,
      errors: 0,
      isGameStarted: false,
      isGameOver: false,
      time: savedSession.time || 60,
      isStartedTimer: false,
      sampleOrUpload: savedSession.sampleOrUpload || "sample",
    };
  });

  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    sessionStorage.setItem("sessionData", JSON.stringify(sessionData));
  }, [sessionData]);

  const contextValue = {
    isGameStarted: sessionData.isGameStarted,
    isGameOver: sessionData.isGameOver,
    nickname: settings.nickname,
    level: settings.level,
    gridSize: settings.gridSize,
    time: sessionData.time,
    isStartedTimer: sessionData.isStartedTimer,
    sampleOrUpload: sessionData.sampleOrUpload,
    cardSets: settings.cardSets,
    theme: settings.theme,
    maxScore: settings.maxScore,
    currentScore: sessionData.currentScore,
    gamesPlayed: sessionData.gamesPlayed,
    errors: sessionData.errors,
    errorLimit: settings.errorLimit,
    progress: sessionData.progress,

    setStartGame: (value: boolean) => setSessionData((prev) => ({ ...prev, isGameStarted: value })),
    setIsGameOver: (value: boolean) => setSessionData((prev) => ({ ...prev, isGameOver: value, time: sessionData.time, progress: 0 })),
    setNickname: (nickname: string) => setSettings((prev) => ({ ...prev, nickname })),
    setLevel: (level: string) => setSettings((prev) => ({ ...prev, level })),
    setGridSize: (value: number) => setSettings((prev) => ({ ...prev, gridSize: value })),
    setTime: (value: number) => setSessionData((prev) => ({ ...prev, time: value })),
    setIsStartedTimer: (isStartedTimer: boolean) => setSessionData((prev) => ({ ...prev, isStartedTimer })),
    setSampleOrUpload: (sampleOrUpload: string) => setSessionData((prev) => ({ ...prev, sampleOrUpload })),
    setCardSets: (cardSets: string) => setSettings((prev) => ({ ...prev, cardSets })),
    setTheme: (theme: string) => setSettings((prev) => ({ ...prev, theme })),
    setMaxScore: (value: number) => setSettings((prev) => ({ ...prev, maxScore: Math.max(prev.maxScore, value) })),
    setCurrentScore: (value: number) => setSessionData((prev) => ({ ...prev, currentScore: value })),
    setGamesPlayed: (value: number) => setSessionData((prev) => ({ ...prev, gamesPlayed: value })),
    setErrors: (value: number) => setSessionData((prev) => ({ ...prev, errors: value })),
    setErrorLimit: (value: number) => setSettings((prev) => ({ ...prev, errorLimit: value })),
    setProgress: (value: number) => setSessionData((prev) => ({ ...prev, progress: value })),
    resetSessionData: () =>
      setSessionData({
        gamesPlayed: 0,
        currentScore: 0,
        progress: 0,
        errors: 0,
        isGameStarted: false,
        isGameOver: false,
        time: sessionData.time,
        isStartedTimer: false,
        sampleOrUpload: "sample",
      }),
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
