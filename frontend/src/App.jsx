
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import AiSettingsPage from './pages/AiSettingsPage'
import AiGamePage from './pages/AiGamePage'
import LocalSettingsPage from './pages/LocalSettingsPage'
import LocalGame from './pages/LocalGame'
import ResultPage from './pages/ResultPage'
import GlowingMark from './pages/GlowingMark'
import Lobby from './pages/FriendsSettingsPage'
import FriendGame from './pages/FriendGame'



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/ai-settings" element={<AiSettingsPage/>}/>
        <Route path="/game/:mode" element={<AiGamePage/>} />
        <Route path="/local-settings" element={<LocalSettingsPage/>} />
        <Route path="/local-game" element={<LocalGame/>} />
        <Route path="/result" element={<ResultPage/>} />
        <Route path="/mark" element={<GlowingMark/>} />
        <Route path="/lobby" element={<Lobby/>} />
       <Route path="/friend-game/:roomId" element={<FriendGame />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
