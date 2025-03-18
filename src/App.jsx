import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import { SpellViewer } from "./components/SpellViewer.jsx";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SpellViewer />} />
        <Route path="/:spellName" element={<SpellViewer />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
