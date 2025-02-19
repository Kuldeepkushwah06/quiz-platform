import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Quiz from './components/Quiz';
import History from './components/History';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium
        ${isActive 
          ? 'bg-white text-blue-600 shadow-md' 
          : 'text-white/90 hover:text-white hover:bg-white/10'
        }`}
    >
      {children}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <span className="text-white text-xl font-bold">
                  Quiz Platform
                </span>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-2">
                <NavLink to="/">
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Take Quiz
                  </span>
                </NavLink>
                <NavLink to="/history">
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    History
                  </span>
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-4">
            <p className="text-center text-gray-600">
              © 2024 Quiz Platform. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App; 