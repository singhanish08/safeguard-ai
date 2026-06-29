const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fallbackAnalysis = {
  category: '',
  severityLevel: 'Medium',
  riskScore: 50,
  rootCauses: ['Unable to determine root causes automatically'],
  immediateActions: ['Review incident details manually', 'Conduct on-site investigation'],
  preventiveMeasures: ['Review safety protocols', 'Schedule additional training'],
  requiredPPE: ['Standard PPE as per department guidelines'],
  environmentalImpact: 'Assessment pending manual review',
  recommendedInvestigation: 'Manual investigation recommended by safety team',
  executiveSummary: 'This incident requires manual review by the safety team. AI analysis was unavailable.',
  generatedAt: new Date(),
  isGenerated: false,
};

const analyzeIncident = async (incidentData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const prompt = `You are a senior industrial safety expert with 20 years of experience in chemical manufacturing, OSHA compliance, and hazard analysis. Analyze the following workplace safety incident and return a structured JSON response only. Do not include any markdown, explanations, or text outside the JSON object.

Incident Details:
Title: ${incidentData.title}
Description: ${incidentData.description}
Category: ${incidentData.category}
Location: ${incidentData.location}
Department: ${incidentData.department}
Date: ${incidentData.incidentDate}
Priority: ${incidentData.priority}

Return this exact JSON structure:
{
  "category": "string (refined incident category)",
  "severityLevel": "Low | Medium | High | Critical",
  "riskScore": number between 0 and 100,
  "rootCauses": ["cause 1", "cause 2", "cause 3"],
  "immediateActions": ["action 1", "action 2", "action 3"],
  "preventiveMeasures": ["measure 1", "measure 2", "measure 3"],
  "requiredPPE": ["ppe 1", "ppe 2"],
  "environmentalImpact": "string describing environmental impact",
  "recommendedInvestigation": "string describing recommended investigation steps",
  "executiveSummary": "2-3 sentence professional summary for management"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(cleaned);

    return {
      category: analysis.category || incidentData.category,
      severityLevel: ['Low', 'Medium', 'High', 'Critical'].includes(analysis.severityLevel)
        ? analysis.severityLevel
        : 'Medium',
      riskScore: Math.min(100, Math.max(0, Number(analysis.riskScore) || 50)),
      rootCauses: Array.isArray(analysis.rootCauses) ? analysis.rootCauses : [],
      immediateActions: Array.isArray(analysis.immediateActions) ? analysis.immediateActions : [],
      preventiveMeasures: Array.isArray(analysis.preventiveMeasures) ? analysis.preventiveMeasures : [],
      requiredPPE: Array.isArray(analysis.requiredPPE) ? analysis.requiredPPE : [],
      environmentalImpact: analysis.environmentalImpact || '',
      recommendedInvestigation: analysis.recommendedInvestigation || '',
      executiveSummary: analysis.executiveSummary || '',
      generatedAt: new Date(),
      isGenerated: true,
    };
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return {
      ...fallbackAnalysis,
      category: incidentData.category,
      generatedAt: new Date(),
    };
  }
};

module.exports = { analyzeIncident };
