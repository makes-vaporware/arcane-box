import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SpellViewer } from "./components/SpellViewer.jsx";

const App = () => {
  return (
    <BrowserRouter basename="/arcane-box">
      <Routes>
        <Route path="/" element={<SpellViewer />} />
        <Route path="/:spellName" element={<SpellViewer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
