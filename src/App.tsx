import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NalityAV from '../n-ality-av/src/App';
import STTComparison from './pages/STTComparison';
import LorenzSynthApp from "./pages/LorenzSynth";

const blogLink = import.meta.env.DEV
  ? 'http://localhost:4321'
  : 'https://blog.colinfreeth.com/';

function App() {
  return (
    <Router>
      <div>
      <nav
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          color: 'white',
          fontWeight: 'bold',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backdropFilter: 'blur(10px)', // Optional: smooth frosted look
        }}
      >
        <Link to="/compare-stt" style={{ color: 'white', textDecoration: 'none' }}>
          STT Compare
        </Link>

        <Link to="/lorenz-synth" style={{ color: 'white', textDecoration: 'none' }}>
          Lorenz Synth
        </Link>

        <span style={{ color: 'white', opacity: 0.5 }}>|</span>

        <a
          href={blogLink}
          style={{ color: 'white', textDecoration: 'none' }}
        >
          Blog
        </a>
      </nav>

        <Routes>
          <Route path="/" element={<NalityAV />} />
          <Route path="/compare-stt" element={<STTComparison />} />
          <Route path="/lorenz-synth" element={<LorenzSynthApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;