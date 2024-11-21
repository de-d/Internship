import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PlayingField from "./pages/PlayingField/PlayingField";
import Settings from "./pages/Settings/Settings";
import Results from "./pages/Results/Results";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlayingField />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
