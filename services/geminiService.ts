import { GoogleGenAI } from "@google/genai";
import { SearchCriteria, SearchResult, Assignment, Candidate, MatchResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Updated to the recommended model for text tasks
const modelId = "gemini-3-flash-preview"; 

export const findCandidates = async (criteria: SearchCriteria): Promise<SearchResult> => {
  const prompt = `
    Act as an Expert Technical Recruiter.
    
    Goal: Find REAL IT Consultant PROFILES (People). 
    
    QUANTITY TARGET: Find at least 10-15 high-quality profiles that match the criteria. Do not stop at just a few.

    CRITICAL: Do NOT return job advertisements, assignments, or company descriptions. Only return individual profiles.

    Criteria:
    - Role: ${criteria.role}
    - Tech Stack: ${criteria.techStack}
    - Level: ${criteria.experienceLevel}
    - Location: ${criteria.location}
    - Keywords: ${criteria.keywords}

    Step 1: Create a boolean search string for LinkedIn (site:linkedin.com/in).
    Step 2: Use Google Search to find profiles matching the boolean string.
    Step 3: Parse and rank the top 10-15 candidates.
    Step 4: Return JSON.
    
    JSON Structure:
    {
      "generatedBooleanString": "string",
      "candidates": [
        {
          "name": "string (Real Name)",
          "currentTitle": "string",
          "location": "string",
          "matchScore": number (0-100),
          "skills": ["string"],
          "summary": "string (Swedish)",
          "justification": "string (Swedish - why this PERSON fits)",
          "profileUrl": "string"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a headhunter. You find PEOPLE, not JOBS. Output strictly JSON.",
        temperature: 0.2,
      },
    });

    let text = response.text;
    
    // Fallback if getter returns undefined but content exists
    if (!text && response.candidates?.[0]?.content?.parts) {
        text = response.candidates[0].content.parts.map(p => p.text).join('');
    }

    if (!text) {
        console.error("Gemini Empty Response:", JSON.stringify(response, null, 2));
        throw new Error("Inget svar från AI. Modellen returnerade ingen text.");
    }
    
    // Robust JSON extraction for Object
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        text = text.substring(start, end + 1);
    } else {
        // Fallback
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const parsedData = JSON.parse(text) as SearchResult;
    parsedData.candidates = parsedData.candidates.map((c, i) => ({
      ...c,
      id: `cand_${i}_${Date.now()}`
    }));
    return parsedData;

  } catch (error) {
    console.error("Candidate Search Error:", error);
    throw new Error(error instanceof Error ? error.message : "Kunde inte hitta kandidater.");
  }
};

// Pure assignment search without candidate matching
export const searchAssignments = async (criteria: SearchCriteria, existingAssignments: Assignment[] = []): Promise<Assignment[]> => {
  const today = new Date().toISOString().split('T')[0];
  const exclusionList = existingAssignments.map(a => `${a.title} (${a.client})`).join(', ');
  
  const prompt = `
    Act as a Sales Manager. Find ACTIVE IT consulting assignments (konsultuppdrag) in Sweden.
    Date: ${today}.
    
    CRITICAL: Do NOT return candidates or personal profiles. Return JOB POSTINGS only.
    
    Criteria:
    - Role: ${criteria.role}
    - Tech: ${criteria.techStack}
    - Location: ${criteria.location}
    - Seniority: ${criteria.experienceLevel}

    Exclude these (already found): [${exclusionList}]

    Sources: Verama, Ework, Uppdrag.net, Opic, Allego, Cinode, LinkedIn Jobs.
    
    Validate dates! Only include active/fresh listings.

    Return JSON:
    [
      {
        "title": "string (Assignment Title)",
        "client": "string (End Client or Broker)",
        "description": "string (Swedish)",
        "location": "string",
        "url": "string",
        "deadline": "string",
        "datePosted": "string",
        "isActive": boolean
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a Sales Manager finding Swedish IT assignments. Output JSON only.",
        temperature: 0.1,
      },
    });

    let text = response.text;

    // Fallback
    if (!text && response.candidates?.[0]?.content?.parts) {
        text = response.candidates[0].content.parts.map(p => p.text).join('');
    }

    if (!text) {
        console.error("Gemini Empty Response (Assignments):", JSON.stringify(response, null, 2));
        throw new Error("Inget svar från AI vid uppdragssökning.");
    }
    
    // Robust JSON extraction for Array
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
        text = text.substring(start, end + 1);
    } else {
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const assignments = JSON.parse(text) as Assignment[];
    return assignments.map((a, i) => ({
      ...a,
      id: `assign_${i}_${Date.now()}`
    }));

  } catch (error) {
    console.error("Assignment Search Error:", error);
    throw new Error("Kunde inte hitta uppdrag.");
  }
};

// Dedicated matching function
export const performMatchmaking = async (candidates: Candidate[], assignments: Assignment[]): Promise<MatchResult[]> => {
  if (candidates.length === 0 || assignments.length === 0) return [];

  const candStr = JSON.stringify(candidates.map(c => ({ id: c.id, name: c.name, skills: c.skills, summary: c.summary })));
  const assignStr = JSON.stringify(assignments.map(a => ({ id: a.id, title: a.title, client: a.client, description: a.description })));

  const prompt = `
    Act as a Senior Account Manager. 
    
    Task: Matrix Match these Consultants to these Assignments.
    
    Consultants: ${candStr}
    Assignments: ${assignStr}

    For EACH pair that makes sense (where there is a decent fit), provide a match analysis.
    If a consultant fits multiple assignments, list them all.
    If an assignment fits multiple consultants, list them all.

    Return JSON:
    [
      {
        "assignmentId": "id from input",
        "candidateId": "id from input",
        "matchScore": number (0-100),
        "reason": "string (Why is this a good match? In Swedish)",
        "strengths": ["string", "string"],
        "gaps": ["string", "string"]
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert matcher. Be critical but constructive. Output JSON only.",
        temperature: 0.2,
      },
    });

    let text = response.text;

    // Fallback
    if (!text && response.candidates?.[0]?.content?.parts) {
        text = response.candidates[0].content.parts.map(p => p.text).join('');
    }

    if (!text) {
        console.error("Gemini Empty Response (Match):", JSON.stringify(response, null, 2));
        throw new Error("Inget svar från AI vid matchning.");
    }
    
    // Robust JSON extraction for Array
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
        text = text.substring(start, end + 1);
    } else {
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    return JSON.parse(text) as MatchResult[];

  } catch (error) {
    console.error("Matchmaking Error:", error);
    throw new Error("Kunde inte utföra matchningen.");
  }
};