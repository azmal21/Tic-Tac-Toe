import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LocalSettingsPage.css";

export default function LocalSettingsPage() {
  const [boardSize, setBoardSize] = useState(3);
  const [winLength, setWinLength] = useState(3);
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/local-game", { state: { boardSize, winLength } });
  };

  // Win options based on board size
  const getWinOptions = (size) => {
    if (size === 3) return [3];
    if (size === 4) return [3, 4];
    if (size === 5) return [4, 5];
    return [3];
  };

  // Change board size and update default winLength
  const handleBoardSizeChange = (newSize) => {
    setBoardSize(newSize);
    const options = getWinOptions(newSize);
    setWinLength(options[0]); // reset to the first valid option
  };

  return (
    <div className="settings-container">
      <h1>Local Game Settings</h1>

      {/* Board size selection */}
      <div className="setting-field">
        <label>
          Board Size:{" "}
          <select
            value={boardSize}
            onChange={(e) => handleBoardSizeChange(Number(e.target.value))}
          >
            <option value={3}>3 x 3</option>
            <option value={4}>4 x 4</option>
            <option value={5}>5 x 5</option>
          </select>
        </label>
      </div>

      {/* Align to win selection */}
      <div className="setting-field">
        <label>
          Align to Win:{" "}
          <select
            value={winLength}
            onChange={(e) => setWinLength(Number(e.target.value))}
          >
            {getWinOptions(boardSize).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Start game button */}
      <button className="start-game-btn" onClick={handleStart}>
        Start Game
      </button>
    </div>
  );
}
