import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NalityAV from '../n-ality-av/src/App';
import STTComparison from './pages/STTComparison';

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
          }}
        >
          <Link to="/compare-stt" style={{ color: 'white', textDecoration: 'none' }}>
            STT Compare
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<NalityAV />} />
          <Route path="/compare-stt" element={<STTComparison />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;