import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import Navbar from './components/layout/Navbar';

// Pages
import Home from './pages/Home/Home';
import Explore from './pages/Explore/Explore';
import Features from './pages/Features/Features';
import FeatureDetail from './pages/Features/FeatureDetail'; // New!
import Assistant from './pages/Assistant/Assistant';
import Contact from './pages/Contact/Contact';

/**
 * App.jsx is the Master Controller.
 * It connects the URL paths to the specific Page components.
 */
function App() {
  return (
    <Router>
      <div className="bg-black min-h-screen text-white selection:bg-indigo-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/features/:id" element={<FeatureDetail />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;