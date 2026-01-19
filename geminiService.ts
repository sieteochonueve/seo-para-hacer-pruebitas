import { GoogleGenAI } from "@google/genai";
import { AuditReport } from "../types";

const SYSTEM_INSTRUCTION = `
You are a World-Class Enterprise SEO Strategist. Your goal is to provide a massive, data-dense SEO audit.
You must use the 'googleSearch' tool to gather real-time data about the URL and its environment.

REQUIREMENTS:
1. DATA DENSITY: Every section must contain detailed audit items.
2. MODAL CONTENT: For every failed audit item and critical finding, provide:
   - "whyItMatters": A 2-line explanation of the SEO impact.
   - "fixSteps": A list of technical instructions to fix the error.
   - "docLink": A relevant link to Google Search Central documentation.
3. CRITICAL FINDINGS: Populate with 3 specific real-world examples:
   - Indexability: "Falta de arquitectura internacional (Hreflang)".
   - Performance: "LCP superior a 2.5s en dispositivos móviles".
   - Authority: "Baja autoridad de dominio comparada con SEIDOR y VASS".
4. AI-SEO: Analyze visibility in ChatGPT, Gemini, Perplexity, Claude.
5. COMPETITIVE: Include competitors with specific metrics and missed keywords.
   - Each competitor must be an object: { "name": "string", "da": number, "strengths": "string", "weaknesses": "string", "missedKeywords": ["string", "string", "string", "string", "string"] }
6. TONE: Professional, precise, and strategic.
7. LANGUAGE: Spanish.

JSON Structure:
{
  "url": "string",
  "timestamp": "string",
  "globalScore": number,
  "pillars": {
    "technical": { 
        "score": number, 
        "subSections": [ 
            { 
                "title": "string", 
                "items": [{ "title": "string", "status": "failed", "description": "string", "recommendation": "string", "proTip": "string", "impact": "High", "effort": "Low", "whyItMatters": "string", "fixSteps": ["string"], "docLink": "string" }] 
            } 
        ] 
    },
    "onPage": { "score": number, "subSections": [] },
    "offPage": { "score": number, "subSections": [] },
    "ux": { "score": number, "subSections": [] },
    "aiSeo": { 
        "score": number, 
        "subSections": [],
        "visibilityMetrics": [],
        "comparison": { "currentMonth": 78, "lastMonth": 72, "trend": "up" },
        "readinessScore": 88
    }
  },
  "competitive": { 
    "competitors": [{ "name": "string", "da": number, "strengths": "string", "weaknesses": "string", "missedKeywords": [] }], 
    "sharedKeywords": [], 
    "contentGaps": [], 
    "strategies": [] 
  },
  "roadmap": [ { "task": "string", "impact": "Alto", "effort": "Bajo", "timeframe": "Quick Win", "description": "string" } ],
  "summary": { 
    "criticalFindings": [{ "title": "string", "status": "failed", "description": "string", "whyItMatters": "string", "fixSteps": ["string"], "docLink": "string", "impact": "High" }], 
    "quickWins": [] 
  }
}
`;

export const analyzeUrl = async (url: string): Promise<AuditReport> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found in environment variables");

    const ai = new GoogleGenAI({ apiKey });
    const modelId = 'gemini-3-flash-preview'; 

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Perform a professional Enterprise SEO Audit for: ${url}. 
      Include 3 critical findings: Hreflang architecture, LCP mobile performance, and domain authority comparison with competitors.
      Provide at least 8 items per section with whyItMatters, fixSteps, and docLink for errors.
      Analyze AI visibility and market competitors.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text) as AuditReport;
  } catch (error) {
    console.error("Audit Analysis Failed:", error);
    throw error;
  }
};