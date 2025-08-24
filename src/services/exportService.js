// PDF Export Service
// src/services/exportService.js

export const generatePDFReport = (analysisData, fileName) => {
  // Create a comprehensive HTML report
  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Resume Analysis Report</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
        .score-section { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .section { margin: 20px 0; padding: 15px; border-left: 4px solid #3B82F6; background: #F8FAFC; }
        .skill-item { display: inline-block; background: #E0E7FF; padding: 5px 10px; margin: 3px; border-radius: 5px; }
        .recommendation { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 10px 0; }
        .strength { background: #D1FAE5; border-left: 4px solid #10B981; padding: 15px; margin: 10px 0; }
        .improvement { background: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; margin: 10px 0; }
        h1, h2, h3 { color: #1F2937; }
        .score-circle { font-size: 48px; font-weight: bold; text-align: center; }
        .breakdown { display: flex; justify-content: space-between; margin: 15px 0; }
        .breakdown-item { text-align: center; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Resume Analysis Report</h1>
        <p><strong>File:</strong> ${fileName}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="score-section">
        <div class="score-circle">${analysisData.overall.score}/100</div>
        <h2 style="text-align: center; margin: 10px 0;">Grade: ${analysisData.overall.grade}</h2>
        <div class="breakdown">
          ${Object.entries(analysisData.overall.breakdown).map(([key, value]) => `
            <div class="breakdown-item">
              <div style="font-size: 20px; font-weight: bold;">${value}%</div>
              <div>${key.charAt(0).toUpperCase() + key.slice(1)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <h2>💪 Strengths</h2>
        ${analysisData.overall.strengths.length > 0 ? 
          analysisData.overall.strengths.map(strength => `
            <div class="strength">
              <strong>${strength.area}</strong> (${strength.score}%)<br>
              ${strength.description}
            </div>
          `).join('') : 
          '<p>Focus on the improvements below to develop your strengths.</p>'
        }
      </div>

      <div class="section">
        <h2>🎯 Areas for Improvement</h2>
        ${analysisData.overall.improvements.length > 0 ?
          analysisData.overall.improvements.map(improvement => `
            <div class="improvement">
              <strong>${improvement.area}</strong> (${improvement.score}%) - ${improvement.priority.toUpperCase()} Priority<br>
              ${improvement.description}
            </div>
          `).join('') :
          '<p>Great! No major areas for improvement identified.</p>'
        }
      </div>

      <div class="section">
        <h2>🛠️ Skills Analysis</h2>
        <p><strong>Total Skills Found:</strong> ${analysisData.skills.total}</p>
        
        ${analysisData.skills.technical.length > 0 ? `
          <h3>Technical Skills:</h3>
          <div>
            ${analysisData.skills.technical.map(skill => `
              <span class="skill-item">${skill.name} (${skill.confidence}%)</span>
            `).join('')}
          </div>
        ` : ''}

        ${analysisData.skills.soft.length > 0 ? `
          <h3>Soft Skills:</h3>
          <div>
            ${analysisData.skills.soft.map(skill => `
              <span class="skill-item">${skill.name} (${skill.confidence}%)</span>
            `).join('')}
          </div>
        ` : ''}
      </div>

      ${analysisData.recommendations && analysisData.recommendations.length > 0 ? `
        <div class="section">
          <h2>📝 Recommendations</h2>
          ${analysisData.recommendations.map(rec => `
            <div class="recommendation">
              <strong>${rec.title}</strong> (${rec.priority.toUpperCase()} Priority)<br>
              <p>${rec.description}</p>
              <p><strong>Action:</strong> ${rec.action}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="section">
        <h2>📊 Resume Sections</h2>
        ${Object.entries(analysisData.sections).map(([section, data]) => `
          <div style="margin: 10px 0;">
            <strong>${section.charAt(0).toUpperCase() + section.slice(1)}:</strong> 
            <span style="color: ${data.present ? '#10B981' : '#EF4444'};">
              ${data.present ? '✅ Present' : '❌ Missing'}
            </span>
            (${data.score}%)
          </div>
        `).join('')}
      </div>

      ${analysisData.ai ? `
        <div class="section">
          <h2>🤖 AI Insights</h2>
          <h3>Key Insights:</h3>
          <ul>
            ${analysisData.ai.insights.map(insight => `<li>${insight}</li>`).join('')}
          </ul>
          
          <h3>Career Positioning:</h3>
          <p>${analysisData.ai.careerPositioning}</p>
          
          <h3>Content Enhancements:</h3>
          <ul>
            ${analysisData.ai.contentEnhancements.map(enhancement => `<li>${enhancement}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280;">
        <p>Generated by AI Resume Analyzer • ${new Date().toLocaleDateString()}</p>
        <p>For best results, review and implement the recommendations above.</p>
      </div>
    </body>
    </html>
  `;

  // Create and download PDF
  const blob = new Blob([reportHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume-analysis-report-${fileName.replace(/\.[^/.]+$/, "")}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Simple JSON export
export const exportAnalysisJSON = (analysisData, fileName) => {
  const dataStr = JSON.stringify(analysisData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume-analysis-${fileName.replace(/\.[^/.]+$/, "")}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};