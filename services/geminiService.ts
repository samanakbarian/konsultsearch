import { GoogleGenAI } from "@google/genai";
import { SearchCriteria, SearchResult, Assignment, Candidate, MatchResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash for speed, but with very strict settings
const modelId = "gemini-3-flash-preview"; 

export const findCandidates = async (criteria: SearchCriteria): Promise<SearchResult> => {
  // STRICT PROMPT: No URLs requested
  const prompt = `
    Role: Technical Recruiter.
    Task: Extract real IT consultant profiles based on search criteria.
    
    Criteria:
    - Role: ${criteria.role}
    - Tech: ${criteria.techStack}
    - Level: ${criteria.experienceLevel}
    - Location: ${criteria.location}
    
    Instructions:
    1. Find REAL people.
    2. Do NOT guess URLs. Do NOT output a profileUrl field.
    3. Focus on accurate Names, Current Titles, and Skills.
    
    Return JSON structure:
    {
      "generatedBooleanString": "string (The boolean query you used)",
      "candidates": [
        {
          "name": "string",
          "currentTitle": "string",
          "location": "string",
          "matchScore": number (0-100),
          "skills": ["string"],
          "summary": "string (Short professional summary in Swedish)",
          "justification": "string (Why is this person a match? in Swedish)"
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
        // Temperature 0.0 ensures the model is as deterministic and factual as possible
        temperature: 0.0, 
        systemInstruction: "You are a precise data extraction engine. You output valid JSON only. You do not hallucinate links.",
      },
    });

    let text = response.text;
    
    // Fallback extraction
    if (!text && response.candidates?.[0]?.content?.parts) {
        text = response.candidates[0].content.parts.map(p => p.text).join('');
    }

    if (!text) throw new Error("Inget svar från AI.");
    
    // JSON Cleaning
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        text = text.substring(start, end + 1);
    } else {
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const parsedData = JSON.parse(text) as SearchResult;
    
    // Assign IDs client-side
    parsedData.candidates = parsedData.candidates.map((c, i) => ({
      ...c,
      id: `cand_${i}_${Date.now()}`
    }));
    return parsedData;

  } catch (error) {
    console.error("Candidate Search Error:", error);
    throw new Error("Kunde inte hämta kandidater. Försök igen.");
  }
};

export const searchAssignments = async (criteria: SearchCriteria, existingAssignments: Assignment[] = []): Promise<Assignment[]> => {
  const today = new Date().toISOString().split('T')[0];
  const exclusionList = existingAssignments.map(a => a.title).join(', ');
  
  // STRICT PROMPT: No URLs requested, Focus on CONSULTING GIGS
  const prompt = `
    Role: Sales Manager specializing in IT Consulting.
    Task: Find active **CONSULTANT ASSIGNMENTS** (Konsultuppdrag) in Sweden.
    Date: ${today}.
    
    Criteria:
    - Role: ${criteria.role}
    - Tech: ${criteria.techStack}
    - Location: ${criteria.location}
    
    Instructions:
    1. **STRICTLY EXCLUDE permanent jobs** (Tillsvidareanställning/Fast anställning).
    2. Look for keywords like "Konsultuppdrag", "Interim", "Freelance", "Contract", "Uppdrag".
    3. Identify the CLIENT (End Customer) clearly.
    4. Identify the SOURCE/BROKER (e.g., Ework, Verama, Cinode, Arbetsförmedlingen, or "Direkt").
    5. **CRITICAL: You CANNOT guess URLs.** Only include a 'url' if the Google Search tool explicitly returns a link to the assignment. If not found, leave 'url' as empty string "".
    6. Ensure the assignment is active/recent.
    7. STRICTLY respect the Location criteria (${criteria.location}).

    Exclude titles: [${exclusionList}]

    Return JSON:
    [
      {
        "title": "string",
        "client": "string",
        "source": "string (The platform/broker where this was found)",
        "url": "string (URL to the ad if available, else empty string)",
        "description": "string (Short summary in Swedish, emphasize project length/scope)",
        "location": "string",
        "deadline": "string (or 'Snarast')",
        "datePosted": "string (e.g. '2 dagar sedan')",
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
        temperature: 0.0,
        systemInstruction: "You are a strict data scraper looking for B2B consultant assignments only. JSON output only.",
      },
    });

    let text = response.text;

    if (!text && response.candidates?.[0]?.content?.parts) {
        text = response.candidates[0].content.parts.map(p => p.text).join('');
    }

    if (!text) throw new Error("Inget svar från AI.");
    
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

export const performMatchmaking = async (candidates: Candidate[], assignments: Assignment[]): Promise<MatchResult[]> => {
  if (candidates.length === 0 || assignments.length === 0) return [];

  const candStr = JSON.stringify(candidates.map(c => ({ id: c.id, name: c.name, skills: c.skills, summary: c.summary })));
  const assignStr = JSON.stringify(assignments.map(a => ({ id: a.id, title: a.title, client: a.client, description: a.description })));

  const prompt = `
    Role: Senior Account Manager.
    Task: Matrix Match Consultants to Assignments.
    
    Consultants: ${candStr}
    Assignments: ${assignStr}

    Return JSON array of matches. Only include meaningful matches (>60%).
    
    [
      {
        "assignmentId": "string",
        "candidateId": "string",
        "matchScore": number (0-100),
        "reason": "string (Swedish analysis)",
        "strengths": ["string"],
        "gaps": ["string"]
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: 0.1,
        systemInstruction: "Output JSON only.",
      },
    });

    let text = response.text;
    
    if (!text && response.candidates?.[0]?.content?.parts) {
        text = response.candidates[0].content.parts.map(p => p.text).join('');
    }

    if (!text) throw new Error("Inget svar vid matchning.");

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