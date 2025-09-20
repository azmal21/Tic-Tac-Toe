import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FriendsSettingsPage.css"

export default function FriendSettings() {
  const [boardSize, setBoardSize] = useState(3);
  const [winLength, setWinLength] = useState(3);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [isHost, setIsHost] = useState(true); // Decide if user is creating or joining
  const navigate = useNavigate();

  const getWinOptions = (size) => {
    if (size === 3) return [3];
    if (size === 4) return [3, 4];
    if (size === 5) return [4, 5];
    return [3];
  };

  const handleBoardSizeChange = (newSize) => {
    setBoardSize(newSize);
    const options = getWinOptions(newSize);
    if (!options.includes(winLength)) setWinLength(options[0]);
  };

  const handleCreate = () => {
    if (!roomId.trim() || !name.trim()) {
      alert("Enter your name and room code!");
      return;
    }
    navigate(`/friend-game/${roomId.toUpperCase()}`, {
      state: { boardSize, winLength, name, isHost: true },
    });
  };

  const handleJoin = () => {
    if (!roomId.trim() || !name.trim()) {
      alert("Enter your name and room code!");
      return;
    }
    navigate(`/friend-game/${roomId.toUpperCase()}`, {
      state: { name, isHost: false }, // Joiner does not send boardSize/winLength
    });
  };

  return (
    <div className="settings-container">
      <h1>Friend Game Settings</h1>

      <div className="setting-field">
        <label>
          Your Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="name-input"
          />
        </label>
      </div>

      <div className="setting-field">
        <label>
          Room Code:{" "}
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            placeholder="e.g. ABCD"
            className="code-input"
          />
        </label>
      </div>

      {/* Only show options if creating a room */}
      {isHost && (
        <>
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
        </>
      )}

      <div className="setting-actions">
        <button
          className="start-game-btn"
          onClick={() => {
            setIsHost(true);
            handleCreate();
          }}
        >
          Create Room
        </button>
        <button
          className="start-game-btn"
          onClick={() => {
            setIsHost(false);
            handleJoin();
          }}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
