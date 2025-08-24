import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-white text-2xl font-bold">
            AI Resume Analyzer
          </Link>
          <nav className="space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-blue-200 transition duration-200"
            >
              Home
            </Link>
            <Link 
              to="/analysis" 
              className="text-white hover:text-blue-200 transition duration-200"
            >
              Analyze
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;