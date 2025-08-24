import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          AI-Powered Resume Analysis
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get instant feedback on your resume with our advanced AI technology. 
          Improve your chances of landing your dream job.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Smart Analysis</h3>
            <p className="text-gray-600">AI-powered analysis of your resume content and structure</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Instant Feedback</h3>
            <p className="text-gray-600">Get immediate recommendations to improve your resume</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Score & Insights</h3>
            <p className="text-gray-600">Receive detailed scores and actionable insights</p>
          </div>
        </div>

        <Link 
          to="/analysis" 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Start Analysis
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
