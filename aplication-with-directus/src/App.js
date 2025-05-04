import Home from './pages/Home';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Winner from './pages/Winner';
import Test from './pages/test';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobby/:gameId" element={<Lobby />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/winner/:gameId" element={<Winner />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
