// Sample Resumes for Testing
// src/components/demo/SampleResumes.js

import React from 'react';
import { DocumentTextIcon, CodeBracketIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const SampleResumes = ({ onSelectSample }) => {
  const sampleResumes = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Full-stack developer with React and Node.js experience',
      icon: CodeBracketIcon,
      content: `JOHN SMITH
Software Engineer

Email: john.smith@email.com
Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith
GitHub: github.com/johnsmith

PROFESSIONAL SUMMARY
Experienced Full-Stack Software Engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies. Proven track record of delivering high-quality solutions that improved user engagement by 40% and reduced system downtime by 60%.

TECHNICAL SKILLS
Frontend: React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS, Redux
Backend: Node.js, Express.js, Python, Django, RESTful APIs, GraphQL
Databases: MySQL, PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, Git, GitHub Actions
Testing: Jest, Cypress, Unit Testing, Integration Testing

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | Jan 2022 - Present
• Developed and maintained 15+ React applications serving 100k+ daily active users
• Implemented microservices architecture reducing API response time by 45%
• Led code reviews and mentored 3 junior developers on best practices
• Optimized database queries resulting in 30% performance improvement

Software Engineer | StartupXYZ | Jun 2019 - Dec 2021
• Built responsive web applications using React and Node.js for e-commerce platform
• Integrated payment systems processing $2M+ in transactions monthly
• Collaborated with design team to implement pixel-perfect UI components
• Reduced bug reports by 50% through comprehensive testing strategies

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2019
Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems

PROJECTS
E-Commerce Platform | Personal Project
• Full-stack application with React frontend and Node.js backend
• Implemented user authentication, payment integration, and admin dashboard
• Technologies: React, Node.js, Express, MongoDB, Stripe API

CERTIFICATIONS
• AWS Certified Developer Associate (2023)
• Google Cloud Professional Developer (2022)`,
      expectedScore: 85
    },
    {
      id: 'marketing-manager',
      title: 'Marketing Manager',
      description: 'Digital marketing professional with campaign management experience',
      icon: ChartBarIcon,
      content: `SARAH JOHNSON
Digital Marketing Manager

Email: sarah.johnson@email.com
Phone: (555) 987-6543
LinkedIn: linkedin.com/in/sarahjohnson

PROFESSIONAL SUMMARY
Results-driven Digital Marketing Manager with 6+ years of experience developing and executing comprehensive marketing strategies. Increased brand awareness by 150% and generated $5M+ in revenue through data-driven campaigns across multiple channels.

CORE COMPETENCIES
Digital Strategy: SEO/SEM, Social Media Marketing, Content Marketing, Email Marketing
Analytics: Google Analytics, HubSpot, Salesforce, A/B Testing, Conversion Optimization
Creative: Campaign Development, Brand Management, Content Creation, Graphic Design
Technical: HTML/CSS, WordPress, Marketing Automation, CRM Systems

PROFESSIONAL EXPERIENCE

Digital Marketing Manager | Growth Agency | Mar 2021 - Present
• Managed marketing budgets totaling $2M annually across 10+ client accounts
• Increased organic website traffic by 200% through SEO optimization strategies
• Led cross-functional team of 5 marketing specialists and 2 designers
• Achieved 25% improvement in lead conversion rates through campaign optimization

Marketing Specialist | Brand Solutions Co. | Aug 2018 - Feb 2021
• Developed and executed social media campaigns reaching 500K+ monthly impressions
• Created email marketing sequences with 35% open rates and 8% click-through rates
• Collaborated with sales team to generate 300+ qualified leads monthly
• Managed company blog increasing organic reach by 180%

EDUCATION
Bachelor of Arts in Marketing | Business University | 2018
Minor in Digital Communications

ACHIEVEMENTS
• "Marketing Campaign of the Year" - Industry Awards 2023
• Increased client ROI by average of 40% across all managed accounts
• Successfully launched 20+ product campaigns with 95% on-time delivery

CERTIFICATIONS
• Google Ads Certified (2023)
• HubSpot Inbound Marketing Certified (2023)
• Facebook Blueprint Certified (2022)`,
      expectedScore: 78
    },
    {
      id: 'entry-level',
      title: 'Recent Graduate',
      description: 'Entry-level resume with education focus',
      icon: DocumentTextIcon,
      content: `ALEX CHEN
Recent Computer Science Graduate

Email: alex.chen@email.com
Phone: (555) 456-7890

OBJECTIVE
Recent Computer Science graduate seeking an entry-level software development position to apply programming skills and contribute to innovative technology solutions.

EDUCATION
Bachelor of Science in Computer Science | State University | May 2024
GPA: 3.7/4.0
Relevant Coursework: Data Structures, Algorithms, Software Engineering, Web Development

TECHNICAL SKILLS
Programming Languages: Java, Python, JavaScript
Web Technologies: HTML, CSS, React
Databases: MySQL, SQLite
Tools: Git, Visual Studio Code

PROJECTS
Personal Portfolio Website
• Created responsive website using HTML, CSS, and JavaScript
• Showcased academic and personal projects

Student Management System
• Developed Java application for managing student records
• Implemented database connectivity using MySQL

EXPERIENCE
Intern | Local Tech Startup | Summer 2023
• Assisted in testing web applications
• Helped with documentation and bug reporting

ACTIVITIES
• Computer Science Club Member
• Volunteer at local coding bootcamp`,
      expectedScore: 65
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Try Sample Resumes
      </h3>
      <p className="text-gray-600 mb-6">
        Test the analyzer with these sample resumes to see how it works
      </p>
      
      <div className="space-y-4">
        {sampleResumes.map((sample) => {
          const Icon = sample.icon;
          return (
            <div
              key={sample.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition duration-200 cursor-pointer"
              onClick={() => onSelectSample(sample)}
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {sample.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {sample.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Expected Score: {sample.expectedScore}/100
                    </span>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                      Try This Resume →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SampleResumes;