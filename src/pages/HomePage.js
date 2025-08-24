// Enhanced Homepage with Working Sample Resume Modal
// src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  SparklesIcon, 
  ChartBarIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import SampleResumes from '../components/demo/SampleResumes';
import { prepareSampleForAnalysis } from '../utils/sampleUtils';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    resumes: 0,
    users: 0,
    improvements: 0
  });
  
  // Modal state for sample resumes
  const [showSamplesModal, setShowSamplesModal] = useState(false);

  // Animated counter effect
  useEffect(() => {
    const animateStats = () => {
      const targets = { resumes: 1247, users: 892, improvements: 94 };
      const duration = 2000;
      const steps = 60;
      const increment = {
        resumes: targets.resumes / steps,
        users: targets.users / steps,
        improvements: targets.improvements / steps
      };

      let current = { resumes: 0, users: 0, improvements: 0 };
      
      const timer = setInterval(() => {
        current.resumes = Math.min(current.resumes + increment.resumes, targets.resumes);
        current.users = Math.min(current.users + increment.users, targets.users);
        current.improvements = Math.min(current.improvements + increment.improvements, targets.improvements);
        
        setStats({
          resumes: Math.floor(current.resumes),
          users: Math.floor(current.users),
          improvements: Math.floor(current.improvements)
        });

        if (current.resumes >= targets.resumes && 
            current.users >= targets.users && 
            current.improvements >= targets.improvements) {
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    };

    const timeout = setTimeout(animateStats, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Handle sample resume selection
  const handleSelectSample = (sample) => {
    // Close the modal
    setShowSamplesModal(false);
    
    // Prepare sample data using utility function
    const sampleData = prepareSampleForAnalysis(sample);

    // Navigate to analysis page with the sample data
    navigate('/analysis', {
      state: { sampleData }
    });
  };

  const features = [
    {
      icon: SparklesIcon,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your resume content, structure, and keywords to provide intelligent insights.",
      color: "blue"
    },
    {
      icon: ChartBarIcon,
      title: "Comprehensive Scoring",
      description: "Get detailed scores across multiple categories with specific recommendations for improvement.",
      color: "purple"
    },
    {
      icon: DocumentTextIcon,
      title: "Industry Standards",
      description: "Benchmarked against current industry standards and hiring manager preferences.",
      color: "green"
    },
    {
      icon: CheckCircleIcon,
      title: "Actionable Feedback",
      description: "Receive specific, actionable recommendations to enhance your resume's effectiveness.",
      color: "orange"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Tech Corp",
      rating: 5,
      text: "The analysis helped me identify weak points I never noticed. Landed my dream job within 2 weeks!"
    },
    {
      name: "Michael Rodriguez",
      role: "Marketing Manager",
      company: "Growth Co",
      rating: 5,
      text: "Incredible insights! The AI recommendations were spot-on and helped me stand out from other candidates."
    },
    {
      name: "Emily Johnson",
      role: "Recent Graduate",
      company: "StartupXYZ",
      rating: 5,
      text: "As a new grad, this tool gave me confidence in my resume. The detailed feedback was invaluable."
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Upload Resume",
      description: "Upload your resume in PDF or DOCX format, or try our sample resumes"
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Our AI analyzes content, structure, keywords, and industry alignment"
    },
    {
      step: 3,
      title: "Get Results",
      description: "Receive detailed scores, insights, and actionable recommendations"
    },
    {
      step: 4,
      title: "Download Report",
      description: "Export your analysis as a comprehensive PDF report"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Sample Resumes Modal */}
      {showSamplesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Try Sample Resumes</h2>
              <button
                onClick={() => setShowSamplesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <SampleResumes onSelectSample={handleSelectSample} />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
              <SparklesIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">AI-Powered Resume Analysis</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transform Your Resume with
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Get instant, professional analysis of your resume with personalized recommendations 
              to boost your chances of landing interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analysis"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 shadow-lg"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Analyze My Resume
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
              <button 
                onClick={() => setShowSamplesModal(true)}
                className="inline-flex items-center px-8 py-4 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition duration-200"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Try Sample Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.resumes.toLocaleString()}+</div>
              <div className="text-gray-600">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.users.toLocaleString()}+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.improvements}%</div>
              <div className="text-gray-600">Average Score Improvement</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get professional resume analysis in minutes with our simple 4-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need to create an outstanding resume
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: "bg-blue-100 text-blue-600",
                purple: "bg-purple-100 text-purple-600",
                green: "bg-green-100 text-green-600",
                orange: "bg-orange-100 text-orange-600"
              };
              
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                  <div className={`w-12 h-12 rounded-lg ${colorClasses[feature.color]} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who improved their resumes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Supercharge Your Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who've improved their job prospects with our AI-powered analysis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analysis"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 shadow-lg"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Get Started Free
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
            <button 
              onClick={() => setShowSamplesModal(true)}
              className="inline-flex items-center px-8 py-4 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition duration-200"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              View Samples
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-8 text-blue-200">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>Takes 2 minutes</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              <span>Trusted by 1000+</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;