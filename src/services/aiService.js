// AI Service Integration - Step 9
// src/services/aiService.js

// AI-powered resume analysis using multiple approaches
class AIResumeAnalyzer {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  // Main AI analysis function
  async analyzeResumeWithAI(resumeText, basicAnalysis) {
    try {
      // If no API key, use enhanced local analysis
      if (!this.apiKey) {
        return this.enhancedLocalAnalysis(resumeText, basicAnalysis);
      }

      // Use OpenAI for intelligent analysis
      const aiInsights = await this.getOpenAIInsights(resumeText, basicAnalysis);
      return this.combineAnalyses(basicAnalysis, aiInsights);

    } catch (error) {
      console.warn('AI analysis failed, falling back to enhanced local analysis:', error);
      return this.enhancedLocalAnalysis(resumeText, basicAnalysis);
    }
  }

  // OpenAI-powered analysis
  async getOpenAIInsights(resumeText, basicAnalysis) {
    const prompt = this.buildAnalysisPrompt(resumeText, basicAnalysis);
    
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cost-effective model
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume analyst and career coach. Provide detailed, actionable feedback to help improve resumes for better job prospects.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseAIResponse(data.choices[0].message.content);
  }

  // Build comprehensive analysis prompt
  buildAnalysisPrompt(resumeText, basicAnalysis) {
    return `
Analyze this resume and provide intelligent insights:

RESUME TEXT:
${resumeText.substring(0, 2000)}...

CURRENT ANALYSIS:
- Overall Score: ${basicAnalysis.overall.score}/100 (${basicAnalysis.overall.grade})
- Skills Found: ${basicAnalysis.skills.total}
- Strengths: ${basicAnalysis.overall.strengths.map(s => s.area).join(', ')}
- Improvements: ${basicAnalysis.overall.improvements.map(i => i.area).join(', ')}

Please provide:

1. INTELLIGENT INSIGHTS (3-4 key observations)
2. CAREER POSITIONING (how to better position for target roles)
3. CONTENT ENHANCEMENT (specific content improvements)
4. INDUSTRY ALIGNMENT (how well aligned with industry standards)
5. COMPETITIVE EDGE (what makes this resume stand out or what's missing)

Format as JSON:
{
  "insights": ["insight1", "insight2", ...],
  "careerPositioning": "detailed positioning advice",
  "contentEnhancements": ["enhancement1", "enhancement2", ...],
  "industryAlignment": "alignment assessment",
  "competitiveEdge": "competitive analysis",
  "aiScore": 85,
  "confidence": "high"
}`;
  }

  // Parse AI response
  parseAIResponse(aiResponse) {
    try {
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing if JSON extraction fails
      return this.fallbackParseResponse(aiResponse);
    } catch (error) {
      console.warn('Failed to parse AI response:', error);
      return this.getDefaultAIInsights();
    }
  }

  // Enhanced local analysis when AI is not available
  enhancedLocalAnalysis(resumeText, basicAnalysis) {
    const insights = this.generateLocalInsights(resumeText, basicAnalysis);
    const careerAdvice = this.generateCareerPositioning(resumeText, basicAnalysis);
    const contentSuggestions = this.generateContentEnhancements(resumeText, basicAnalysis);

    return {
      ...basicAnalysis,
      ai: {
        insights: insights,
        careerPositioning: careerAdvice,
        contentEnhancements: contentSuggestions,
        industryAlignment: this.assessIndustryAlignment(resumeText),
        competitiveEdge: this.analyzeCompetitiveEdge(resumeText, basicAnalysis),
        aiScore: this.calculateAIScore(basicAnalysis),
        confidence: 'high',
        source: 'enhanced_local'
      }
    };
  }

  // Generate intelligent local insights
  generateLocalInsights(resumeText, basicAnalysis) {
    const insights = [];
    const { skills, overall } = basicAnalysis;

    // Technical depth insight
    if (skills.technical.length > 8) {
      insights.push("Strong technical skill diversity suggests versatility and adaptability to different technology stacks.");
    } else if (skills.technical.length < 5) {
      insights.push("Limited technical skills listed - consider expanding to show broader capabilities.");
    }

    // Experience narrative insight
    const hasNumbers = /\d+%|\$\d+|\d+\s*(years?|months?)/gi.test(resumeText);
    if (hasNumbers) {
      insights.push("Good use of quantified achievements demonstrates measurable impact and results-oriented mindset.");
    } else {
      insights.push("Adding specific metrics and numbers would significantly strengthen impact statements.");
    }

    // Industry alignment insight
    const industryKeywords = this.detectIndustryFocus(resumeText);
    if (industryKeywords.length > 0) {
      insights.push(`Strong alignment with ${industryKeywords.join(' and ')} industry standards and terminology.`);
    }

    // Leadership potential insight
    const leadershipWords = ['led', 'managed', 'directed', 'coordinated', 'supervised'];
    const hasLeadership = leadershipWords.some(word => resumeText.toLowerCase().includes(word));
    if (hasLeadership) {
      insights.push("Leadership experience evident - valuable for senior and management-track positions.");
    }

    return insights.slice(0, 4); // Return top 4 insights
  }

  // Generate career positioning advice
  generateCareerPositioning(resumeText, basicAnalysis) {
    const { skills } = basicAnalysis;
    const industries = this.detectIndustryFocus(resumeText);
    
    let advice = "Based on your skill profile, ";
    
    if (skills.technical.length > skills.soft.length) {
      advice += "you're well-positioned for technical roles and should emphasize your technical expertise. ";
    } else {
      advice += "your balanced skill set suggests good fit for hybrid technical-business roles. ";
    }

    if (industries.includes('technology')) {
      advice += "Your tech industry alignment is strong - consider highlighting experience with modern development practices, cloud technologies, and agile methodologies.";
    } else {
      advice += "Consider emphasizing transferable technical skills and any exposure to digital transformation initiatives.";
    }

    return advice;
  }

  // Generate content enhancement suggestions
  generateContentEnhancements(resumeText, basicAnalysis) {
    const suggestions = [];
    const { overall, skills } = basicAnalysis;

    // Content structure improvements
    if (overall.breakdown.structure < 70) {
      suggestions.push("Restructure content with clear sections: Summary, Experience, Skills, Education, Projects");
      suggestions.push("Use consistent bullet point formatting and parallel structure");
    }

    // Skills presentation
    if (skills.total < 8) {
      suggestions.push("Expand skills section with both technical and soft skills relevant to your target role");
    }
    if (skills.technical.length > 0 && skills.soft.length < 3) {
      suggestions.push("Balance technical skills with soft skills like leadership, communication, and problem-solving");
    }

    // Impact statements
    const hasWeakVerbs = /responsible for|duties included|worked on/i.test(resumeText);
    if (hasWeakVerbs) {
      suggestions.push("Replace weak phrases like 'responsible for' with strong action verbs like 'achieved', 'implemented', 'optimized'");
    }

    // Quantification
    const hasQuantifiedResults = /\d+%|\$[\d,]+|saved|increased|reduced|improved.*\d+/i.test(resumeText);
    if (!hasQuantifiedResults) {
      suggestions.push("Add specific metrics: 'Increased efficiency by 30%', 'Managed budget of $500K', 'Led team of 8 developers'");
    }

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  // Assess industry alignment
  assessIndustryAlignment(resumeText) {
    const industries = this.detectIndustryFocus(resumeText);
    const text = resumeText.toLowerCase();
    
    let alignment = "Your resume shows ";
    
    if (industries.length === 0) {
      alignment += "limited industry-specific terminology. Consider adding relevant industry keywords and concepts.";
    } else if (industries.length === 1) {
      alignment += `strong alignment with the ${industries[0]} industry. Good use of relevant terminology and concepts.`;
    } else {
      alignment += `versatility across ${industries.join(' and ')} industries, which is valuable for cross-functional roles.`;
    }

    // Check for modern practices
    const modernTerms = ['agile', 'scrum', 'devops', 'cloud', 'digital transformation', 'automation'];
    const modernCount = modernTerms.filter(term => text.includes(term)).length;
    
    if (modernCount > 2) {
      alignment += " Strong evidence of modern industry practices and methodologies.";
    }

    return alignment;
  }

  // Analyze competitive edge
  analyzeCompetitiveEdge(resumeText, basicAnalysis) {
    const { skills, overall } = basicAnalysis;
    let edge = "";

    // Unique skill combinations
    if (skills.technical.length > 5 && skills.soft.length > 3) {
      edge += "Strong combination of technical depth and soft skills creates competitive advantage. ";
    }

    // Quantified achievements
    const hasStrongMetrics = /\d+%.*improved|increased.*\d+%|reduced.*\d+%/i.test(resumeText);
    if (hasStrongMetrics) {
      edge += "Quantified achievements demonstrate clear business impact. ";
    }

    // Areas for improvement
    if (overall.score < 75) {
      edge += "To strengthen competitive position, focus on: " + 
        overall.improvements.slice(0, 2).map(i => i.area.toLowerCase()).join(" and ") + ".";
    } else {
      edge += "Strong overall profile - focus on tailoring content for specific target roles.";
    }

    return edge || "Solid foundation with room for strategic positioning improvements.";
  }

  // Calculate AI-enhanced score
  calculateAIScore(basicAnalysis) {
    const baseScore = basicAnalysis.overall.score;
    
    // Apply AI insights bonus/penalty
    let aiScore = baseScore;
    
    // Bonus for strong skill diversity
    if (basicAnalysis.skills.total > 10) aiScore += 3;
    
    // Bonus for balanced profile
    const techSkills = basicAnalysis.skills.technical.length;
    const softSkills = basicAnalysis.skills.soft.length;
    if (techSkills > 0 && softSkills > 0 && Math.abs(techSkills - softSkills) <= 3) {
      aiScore += 2;
    }
    
    // Penalty for major gaps
    if (basicAnalysis.overall.improvements.length > 3) aiScore -= 2;
    
    return Math.min(Math.max(aiScore, 0), 100);
  }

  // Detect industry focus from resume text
  detectIndustryFocus(resumeText) {
    const text = resumeText.toLowerCase();
    const industries = [];

    const industryPatterns = {
      technology: ['software', 'programming', 'development', 'tech', 'digital', 'api', 'database'],
      finance: ['financial', 'banking', 'investment', 'accounting', 'audit', 'portfolio'],
      healthcare: ['medical', 'clinical', 'patient', 'healthcare', 'hospital', 'pharmacy'],
      marketing: ['marketing', 'campaign', 'brand', 'advertising', 'social media', 'seo'],
      education: ['education', 'teaching', 'curriculum', 'student', 'academic', 'research']
    };

    Object.entries(industryPatterns).forEach(([industry, keywords]) => {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      if (matches >= 2) {
        industries.push(industry);
      }
    });

    return industries;
  }

  // Combine basic and AI analyses
  combineAnalyses(basicAnalysis, aiInsights) {
    return {
      ...basicAnalysis,
      ai: {
        ...aiInsights,
        source: 'openai'
      },
      // Update overall score with AI insights
      overall: {
        ...basicAnalysis.overall,
        score: aiInsights.aiScore || basicAnalysis.overall.score
      }
    };
  }

  // Fallback response parsing
  fallbackParseResponse(response) {
    return {
      insights: ["AI analysis completed successfully"],
      careerPositioning: "Consider optimizing your resume for your target role",
      contentEnhancements: ["Review formatting and structure", "Add quantifiable achievements"],
      industryAlignment: "Good industry alignment",
      competitiveEdge: "Strong foundation with room for improvement",
      aiScore: 75,
      confidence: "medium"
    };
  }

  // Default AI insights when all else fails
  getDefaultAIInsights() {
    return {
      insights: ["Resume analysis completed with local algorithms"],
      careerPositioning: "Focus on highlighting your strongest skills and achievements",
      contentEnhancements: ["Use strong action verbs", "Quantify your achievements", "Tailor content to target roles"],
      industryAlignment: "Consider adding more industry-specific keywords",
      competitiveEdge: "Solid profile - focus on unique value proposition",
      aiScore: 70,
      confidence: "medium"
    };
  }
}

// Export AI service instance
export const aiService = new AIResumeAnalyzer();

// Main AI analysis function for easy import
export const analyzeWithAI = async (resumeText, basicAnalysis) => {
  return await aiService.analyzeResumeWithAI(resumeText, basicAnalysis);
};