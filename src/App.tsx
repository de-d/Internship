import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import PlayingField from "./pages/PlayingField/PlayingField";
import Settings from "./pages/Settings/Settings";
import Results from "./pages/Results/Results";
import style from "./styles/App.module.scss";

function App() {
  const { theme } = useContext(AppContext) || {};

  return (
    <div className={`${style.app} ${theme === "Light" ? style["light-theme"] : style["dark-theme"]}`}>
      <Router>
        <Routes>
          <Route path="/" element={<PlayingField />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
