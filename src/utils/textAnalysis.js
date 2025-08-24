// Enhanced Resume Analysis Algorithms - Step 8
// src/utils/textAnalysis.js

// Comprehensive skill databases
const SKILL_DATABASES = {
  technical: {
    programming: [
      'javascript', 'python', 'java', 'cplusplus', 'csharp', 'php', 'ruby', 'go', 'rust', 'kotlin',
      'swift', 'typescript', 'scala', 'perl', 'r', 'matlab', 'sql', 'html', 'css', 'sass',
      'less', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
      'laravel', 'rails', 'asp.net', 'jquery', 'bootstrap', 'tailwind', 'c++', 'c#'
    ],
    frameworks: [
      'react', 'angular', 'vue.js', 'node.js', 'express.js', 'django', 'flask', 'spring boot',
      'laravel', 'ruby on rails', 'asp.net', 'ember.js', 'backbone.js', 'meteor', 'gatsby',
      'next.js', 'nuxt.js', 'svelte', 'fastapi', 'nestjs'
    ],
    databases: [
      'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'oracle',
      'sql server', 'dynamodb', 'cassandra', 'neo4j', 'firebase', 'supabase'
    ],
    cloud: [
      'aws', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab ci',
      'github actions', 'terraform', 'ansible', 'chef', 'puppet', 'vagrant'
    ],
    tools: [
      'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'figma',
      'sketch', 'adobe xd', 'photoshop', 'illustrator', 'vs code', 'intellij', 'eclipse'
    ]
  },
  soft: {
    leadership: [
      'leadership', 'team management', 'project management', 'strategic planning',
      'mentoring', 'coaching', 'delegation', 'decision making', 'conflict resolution'
    ],
    communication: [
      'communication', 'presentation', 'public speaking', 'writing', 'documentation',
      'interpersonal skills', 'collaboration', 'negotiation', 'customer service'
    ],
    analytical: [
      'problem solving', 'analytical thinking', 'critical thinking', 'research',
      'data analysis', 'troubleshooting', 'debugging', 'optimization'
    ],
    personal: [
      'adaptability', 'creativity', 'innovation', 'time management', 'organization',
      'attention to detail', 'multitasking', 'self-motivated', 'proactive'
    ]
  },
  industry: {
    marketing: [
      'seo', 'sem', 'google analytics', 'social media marketing', 'content marketing',
      'email marketing', 'ppc', 'conversion optimization', 'a/b testing', 'hubspot'
    ],
    finance: [
      'financial analysis', 'budgeting', 'forecasting', 'risk management', 'excel',
      'quickbooks', 'sap', 'bloomberg terminal', 'financial modeling'
    ],
    design: [
      'ui/ux design', 'graphic design', 'web design', 'prototyping', 'wireframing',
      'user research', 'usability testing', 'design thinking', 'brand design'
    ]
  }
};

// Industry-specific keywords for better context
const INDUSTRY_KEYWORDS = {
  technology: [
    'software', 'development', 'programming', 'coding', 'algorithm', 'architecture',
    'api', 'database', 'frontend', 'backend', 'fullstack', 'devops', 'agile', 'scrum'
  ],
  marketing: [
    'campaign', 'brand', 'digital marketing', 'growth', 'acquisition', 'retention',
    'roi', 'kpi', 'conversion', 'engagement', 'lead generation'
  ],
  finance: [
    'accounting', 'audit', 'tax', 'investment', 'portfolio', 'compliance',
    'financial reporting', 'budgeting', 'forecasting', 'valuation'
  ],
  healthcare: [
    'patient care', 'medical', 'clinical', 'diagnosis', 'treatment', 'healthcare',
    'nursing', 'pharmacy', 'surgery', 'research'
  ]
};

// Enhanced section detection patterns
const SECTION_PATTERNS = {
  contact: {
    indicators: ['email', 'phone', 'address', 'linkedin', 'github', '@', 'tel:', 'mailto:'],
    required: true,
    weight: 0.15
  },
  summary: {
    indicators: ['summary', 'objective', 'profile', 'about', 'overview'],
    required: true,
    weight: 0.10
  },
  experience: {
    indicators: ['experience', 'work history', 'employment', 'career', 'professional'],
    required: true,
    weight: 0.35
  },
  education: {
    indicators: ['education', 'degree', 'university', 'college', 'school', 'certification'],
    required: true,
    weight: 0.20
  },
  skills: {
    indicators: ['skills', 'technical skills', 'competencies', 'expertise', 'technologies'],
    required: true,
    weight: 0.15
  },
  projects: {
    indicators: ['projects', 'portfolio', 'work samples', 'achievements'],
    required: false,
    weight: 0.05
  }
};

// Enhanced analysis function
export const analyzeResumeText = (text) => {
  if (!text || text.trim().length === 0) {
    throw new Error('No text content found in resume');
  }

  const analysis = {
    overall: calculateOverallScore(text),
    sections: analyzeSections(text),
    skills: analyzeSkills(text),
    recommendations: generateRecommendations(text),
    metadata: {
      wordCount: text.split(/\s+/).length,
      characterCount: text.length,
      estimatedReadTime: Math.ceil(text.split(/\s+/).length / 200),
      analyzedAt: new Date().toISOString()
    }
  };

  return analysis;
};

// Enhanced overall score calculation
const calculateOverallScore = (text) => {
  const scores = {
    content: calculateContentScore(text),
    structure: calculateStructureScore(text),
    keywords: calculateKeywordScore(text),
    completeness: calculateCompletenessScore(text)
  };

  // Weighted average
  const weights = { content: 0.3, structure: 0.25, keywords: 0.25, completeness: 0.2 };
  const totalScore = Object.keys(scores).reduce((total, key) => {
    return total + (scores[key] * weights[key]);
  }, 0);

  return {
    score: Math.round(totalScore),
    grade: getGrade(totalScore),
    breakdown: scores,
    strengths: identifyStrengths(scores),
    improvements: identifyImprovements(scores)
  };
};

// Content quality scoring
const calculateContentScore = (text) => {
  let score = 0;
  const words = text.toLowerCase().split(/\s+/);
  
  // Length check (optimal: 400-800 words)
  const wordCount = words.length;
  if (wordCount >= 400 && wordCount <= 800) score += 25;
  else if (wordCount >= 300 && wordCount < 400) score += 20;
  else if (wordCount >= 200 && wordCount < 300) score += 15;
  else if (wordCount < 200) score += 5;
  else score += 10; // too long

  // Action words presence
  const actionWords = [
    'achieved', 'improved', 'increased', 'developed', 'created', 'managed', 'led',
    'implemented', 'designed', 'optimized', 'reduced', 'streamlined', 'delivered'
  ];
  const actionWordCount = actionWords.filter(word => text.toLowerCase().includes(word)).length;
  score += Math.min(actionWordCount * 3, 25);

  // Quantifiable achievements
  const quantifiers = text.match(/\d+%|\$\d+|(\d+)\s*(million|thousand|k\b)/gi);
  if (quantifiers) {
    score += Math.min(quantifiers.length * 5, 25);
  }

  // Professional language (avoid personal pronouns)
  const personalPronouns = (text.match(/\b(i|me|my|myself)\b/gi) || []).length;
  score += Math.max(0, 25 - personalPronouns * 2);

  return Math.min(score, 100);
};

// Structure and formatting score
const calculateStructureScore = (text) => {
  let score = 0;
  
  // Section presence
  const sections = Object.keys(SECTION_PATTERNS);
  const foundSections = sections.filter(section => {
    const patterns = SECTION_PATTERNS[section].indicators;
    return patterns.some(pattern => 
      text.toLowerCase().includes(pattern.toLowerCase())
    );
  });
  score += (foundSections.length / sections.length) * 40;

  // Consistent formatting indicators
  const bullets = (text.match(/[•·▪▫-]\s/g) || []).length;
  if (bullets > 5) score += 20;

  // Proper capitalization
  const sentences = text.split(/[.!?]+/);
  const properlyCapitalized = sentences.filter(s => 
    s.trim().length > 0 && /^[A-Z]/.test(s.trim())
  ).length;
  score += (properlyCapitalized / Math.max(sentences.length, 1)) * 20;

  // Length consistency (not too short, not too long)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  score += Math.min(lines.length, 20);

  return Math.min(score, 100);
};

// Keyword relevance scoring
const calculateKeywordScore = (text) => {
  const lowerText = text.toLowerCase();
  let score = 0;

  // Technical skills
  Object.values(SKILL_DATABASES.technical).flat().forEach(skill => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSkill, 'i');
    if (regex.test(text)) {
      score += 2;
    }
  });

  // Soft skills
  Object.values(SKILL_DATABASES.soft).flat().forEach(skill => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSkill, 'i');
    if (regex.test(text)) {
      score += 1;
    }
  });

  // Industry keywords
  Object.values(INDUSTRY_KEYWORDS).flat().forEach(keyword => {
    if (lowerText.includes(keyword.toLowerCase())) {
      score += 1.5;
    }
  });

  return Math.min(score, 100);
};

// Completeness scoring
const calculateCompletenessScore = (text) => {
  let score = 0;
  const lowerText = text.toLowerCase();

  // Required sections
  Object.entries(SECTION_PATTERNS).forEach(([section, config]) => {
    const hasSection = config.indicators.some(indicator => 
      lowerText.includes(indicator.toLowerCase())
    );
    if (hasSection) {
      score += config.required ? 20 : 10;
    }
  });

  // Contact information
  const hasEmail = /@/.test(text);
  const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text);
  if (hasEmail) score += 10;
  if (hasPhone) score += 10;

  return Math.min(score, 100);
};

// Enhanced skills analysis
const analyzeSkills = (text) => {
  const skills = {
    technical: [],
    soft: [],
    industry: [],
    total: 0
  };

  // Extract technical skills
  Object.entries(SKILL_DATABASES.technical).forEach(([category, skillList]) => {
    const foundSkills = skillList.filter(skill => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSkill, 'i');
      return regex.test(text);
    });
    skills.technical.push(...foundSkills.map(skill => ({
      name: skill,
      category: category,
      confidence: calculateSkillConfidence(skill, text)
    })));
  });

  // Extract soft skills
  Object.entries(SKILL_DATABASES.soft).forEach(([category, skillList]) => {
    const foundSkills = skillList.filter(skill => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSkill, 'i');
      return regex.test(text);
    });
    skills.soft.push(...foundSkills.map(skill => ({
      name: skill,
      category: category,
      confidence: calculateSkillConfidence(skill, text)
    })));
  });

  // Extract industry skills
  Object.entries(SKILL_DATABASES.industry).forEach(([industry, skillList]) => {
    const foundSkills = skillList.filter(skill => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSkill, 'i');
      return regex.test(text);
    });
    skills.industry.push(...foundSkills.map(skill => ({
      name: skill,
      category: industry,
      confidence: calculateSkillConfidence(skill, text)
    })));
  });

  skills.total = skills.technical.length + skills.soft.length + skills.industry.length;

  return skills;
};

// Calculate confidence score for individual skills
const calculateSkillConfidence = (skill, text) => {
  // Escape special regex characters
  const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSkill, 'gi');
  const occurrences = (text.match(regex) || []).length;
  
  const contextWords = ['experience', 'expert', 'proficient', 'skilled', 'years'];
  const hasContext = contextWords.some(word => {
    const contextRegex = new RegExp(`${escapedSkill}\\s+${word}|${word}\\s+${escapedSkill}`, 'i');
    return contextRegex.test(text);
  });
  
  let confidence = Math.min(occurrences * 20, 80);
  if (hasContext) confidence += 20;
  
  return Math.min(confidence, 100);
};

// Enhanced recommendations engine
const generateRecommendations = (text) => {
  const recommendations = [];
  const lowerText = text.toLowerCase();
  
  // Content recommendations
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 300) {
    recommendations.push({
      type: 'content',
      priority: 'high',
      title: 'Expand Resume Content',
      description: 'Your resume is too brief. Add more detail about your achievements and responsibilities.',
      action: 'Add 2-3 bullet points to each job description'
    });
  } else if (wordCount > 1000) {
    recommendations.push({
      type: 'content',
      priority: 'medium',
      title: 'Condense Resume Content',
      description: 'Your resume is quite lengthy. Focus on the most relevant and impactful information.',
      action: 'Remove less relevant details and focus on key achievements'
    });
  }

  // Skills recommendations
  const skillsCount = analyzeSkills(text).total;
  if (skillsCount < 5) {
    recommendations.push({
      type: 'skills',
      priority: 'high',
      title: 'Add More Skills',
      description: 'Include more technical and soft skills relevant to your field.',
      action: 'Create a dedicated skills section with 8-12 relevant skills'
    });
  }

  // Quantification recommendations
  const hasNumbers = /\d+%|\$\d+|\d+\s*(million|thousand|k\b)/.test(text);
  if (!hasNumbers) {
    recommendations.push({
      type: 'impact',
      priority: 'high',
      title: 'Quantify Achievements',
      description: 'Add numbers, percentages, and metrics to demonstrate your impact.',
      action: 'Include specific results like "Increased sales by 25%" or "Managed team of 8"'
    });
  }

  // Action words recommendations
  const actionWords = ['achieved', 'improved', 'increased', 'developed', 'managed', 'led'];
  const hasActionWords = actionWords.some(word => lowerText.includes(word));
  if (!hasActionWords) {
    recommendations.push({
      type: 'language',
      priority: 'medium',
      title: 'Use Action Words',
      description: 'Start bullet points with strong action verbs.',
      action: 'Use words like "achieved", "improved", "developed", "managed"'
    });
  }

  // Contact information
  if (!/@/.test(text)) {
    recommendations.push({
      type: 'contact',
      priority: 'critical',
      title: 'Add Email Address',
      description: 'Your resume is missing an email address.',
      action: 'Include a professional email address in the contact section'
    });
  }

  // Professional summary
  if (!['summary', 'objective', 'profile'].some(word => lowerText.includes(word))) {
    recommendations.push({
      type: 'structure',
      priority: 'medium',
      title: 'Add Professional Summary',
      description: 'Include a brief professional summary at the top of your resume.',
      action: 'Write 2-3 sentences highlighting your key qualifications'
    });
  }

  return recommendations.sort((a, b) => {
    const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorities[b.priority] - priorities[a.priority];
  });
};

// Section analysis
const analyzeSections = (text) => {
  const sections = {};
  const lowerText = text.toLowerCase();

  Object.entries(SECTION_PATTERNS).forEach(([sectionName, config]) => {
    const hasSection = config.indicators.some(indicator => 
      lowerText.includes(indicator.toLowerCase())
    );
    
    sections[sectionName] = {
      present: hasSection,
      required: config.required,
      weight: config.weight,
      score: hasSection ? 100 : 0,
      suggestions: hasSection ? [] : [`Add a ${sectionName} section to your resume`]
    };
  });

  return sections;
};

// Utility functions
const getGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  return 'D';
};

const identifyStrengths = (scores) => {
  const strengths = [];
  Object.entries(scores).forEach(([area, score]) => {
    if (score >= 80) {
      strengths.push({
        area: area.charAt(0).toUpperCase() + area.slice(1),
        score,
        description: getStrengthDescription(area, score)
      });
    }
  });
  return strengths;
};

const identifyImprovements = (scores) => {
  const improvements = [];
  Object.entries(scores).forEach(([area, score]) => {
    if (score < 70) {
      improvements.push({
        area: area.charAt(0).toUpperCase() + area.slice(1),
        score,
        description: getImprovementDescription(area, score),
        priority: score < 50 ? 'high' : 'medium'
      });
    }
  });
  return improvements;
};

const getStrengthDescription = (area, score) => {
  const descriptions = {
    content: 'Excellent use of action words and quantified achievements',
    structure: 'Well-organized with clear sections and consistent formatting',
    keywords: 'Strong inclusion of relevant industry keywords and skills',
    completeness: 'Contains all essential resume sections and information'
  };
  return descriptions[area] || 'Strong performance in this area';
};

const getImprovementDescription = (area, score) => {
  const descriptions = {
    content: 'Consider adding more specific achievements and action words',
    structure: 'Improve organization and formatting consistency',
    keywords: 'Include more relevant skills and industry-specific terms',
    completeness: 'Add missing resume sections and contact information'
  };
  return descriptions[area] || 'This area needs attention';
};