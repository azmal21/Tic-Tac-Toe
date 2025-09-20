import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/AiSettingsPage.css";

const AiSettingsPage = () => {
  const [boardSize, setBoardSize] = useState(3);
  const [alignToWin, setAlignToWin] = useState(3);
  const [difficulty, setDifficulty] = useState("easy");
  const navigate = useNavigate();

  // Function to decide align options based on board size
  const getAlignOptions = (size) => {
    if (size === 3) return [3];
    if (size === 4) return [3, 4];
    if (size === 5) return [4, 5];
    return [3]; // default
  };

  // Update align when board size changes
  const handleBoardChange = (e) => {
    const newSize = Number(e.target.value);
    setBoardSize(newSize);

    // Always reset align to the first valid option
    const newAlignOptions = getAlignOptions(newSize);
    setAlignToWin(newAlignOptions[0]);
  };

  const handleStartGame = () => {
    navigate(`/game/ai?boardSize=${boardSize}&align=${alignToWin}&difficulty=${difficulty}`);
  };

  return (
    <div className="ai-settings-page">
      <h1 className="ai-title">AI Game Settings</h1>

      <div className="ai-field">
        <label className="ai-label">Select board size:</label>
        <select
          className="ai-select"
          value={boardSize}
          onChange={handleBoardChange}
        >
          <option value={3}>3x3</option>
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
        </select>
      </div>

      <div className="ai-field">
        <label className="ai-label">Align to Win:</label>
        <select
          className="ai-select"
          value={alignToWin}
          onChange={(e) => setAlignToWin(Number(e.target.value))}
        >
          {getAlignOptions(boardSize).map((option) => (
            <option key={option} value={option}>
              {option} in a row
            </option>
          ))}
        </select>
      </div>

      <div className="ai-field">
        <label className="ai-label">Difficulty:</label>
        <select
          className="ai-select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button className="ai-button" onClick={handleStartGame}>
        Start Game
      </button>
    </div>
  );
};

export default AiSettingsPage;
