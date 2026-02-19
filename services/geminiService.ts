import { GoogleGenAI } from "@google/genai";
import { SearchCriteria, SearchResult, Assignment, Candidate, MatchResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash for speed/cost, but with high-quality prompting
const modelId = "gemini-3-flash-preview"; 

// Robust retry wrapper for API calls to handle transient network/RPC errors
async function generateContentWithRetry(params: any, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await ai.models.generateContent({
        model: modelId,
        ...params
      });
    } catch (error: any) {
      lastError = error;
      console.warn(`Gemini API attempt ${i + 1} failed:`, error.message);
      
      // Check for transient errors (500, xhr, fetch failures)
      const isTransient = 
        error.status === 500 || 
        error.message?.toLowerCase().includes('xhr') || 
        error.message?.toLowerCase().includes('fetch') ||
        error.message?.toLowerCase().includes('network') ||
        error.message?.toLowerCase().includes('rpc');

      if (!isTransient) throw error; // Don't retry on 400s or logic errors

      // Exponential backoff: 1s, 2s, 4s
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

export const findCandidates = async (criteria: SearchCriteria): Promise<SearchResult> => {
  // Construct a "Mental" Boolean string for the AI to guide its tool use
  const techTerms = criteria.techStack.split(',').join(' OR ');
  const constructedBoolean = `site:linkedin.com/in ("${criteria.role}" OR "Systemutvecklare" OR "Konsult") AND (${techTerms}) AND "${criteria.location}"`;

  const prompt = `
    Role: Expert Technical Sourcer / Headhunter.
    Goal: Find 10-15 REAL, verifyable IT consultants/specialists matching the criteria.
    
    SEARCH CRITERIA:
    - Role: ${criteria.role} (Look for synonyms like Systemutvecklare, Programmerare, Specialist)
    - Tech Stack: ${criteria.techStack}
    - Location: ${criteria.location} (Prioritize exact city matches, then surrounding region)
    - Level: ${criteria.experienceLevel}
    
    EXECUTION STEPS (Use Google Search Tool):
    1. Perform an X-Ray search targeting LinkedIn profiles using logic similar to: ${constructedBoolean}
    2. Look for profiles explicitly mentioning "Konsult", "Freelance", "Egenföretagare", or working at known consultancy firms (e.g., Knowit, Tietoevry, Sogeti, Consid, etc. in ${criteria.location}).
    3. Filter out students or people who haven't updated their profile in years.
    
    OUTPUT RULES:
    1. **REAL PEOPLE ONLY**: Do not hallucinate names. If you find fewer than 10, return what you found.
    2. **Skills**: General list of skills relevant to the role.
    3. **Extracted Skills (CRITICAL)**: Analyze the candidate's summary and headline. Explicitly extract a distinct list of hard technical skills (e.g., 'React', 'Kubernetes', 'Python', 'AWS') found in the text.
    4. **Match Score**: calculate based on keyword overlap (Tech + Role + Location).
    5. **Justification**: Write a short pitch in Swedish regarding why they are a good fit for a ${criteria.role} role in ${criteria.location}.

    Return JSON structure:
    {
      "generatedBooleanString": "${constructedBoolean}",
      "candidates": [
        {
          "name": "string",
          "currentTitle": "string",
          "location": "string",
          "matchScore": number (0-100),
          "skills": ["string"],
          "extractedSkills": ["string"],
          "summary": "string (Professional summary/Headline)",
          "justification": "string (Why this profile matches)"
        }
      ]
    }
  `;

  try {
    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Low temp for factual extraction
        systemInstruction: "You are a specialized Recruiter Bot. You extract real public profile data from search results. You prioritize local candidates.",
      },
    });

    let text = response.text;
    
    if (!text && response.candidates?.[0]?.content?.parts) {
        text = response.candidates[0].content.parts.map(p => p.text).join('');
    }

    if (!text) throw new Error("Kunde inte generera kandidater. Försök specificera sökningen.");
    
    // Robust JSON cleanup
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        text = text.substring(start, end + 1);
    } else {
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const parsedData = JSON.parse(text) as SearchResult;
    
    // Fallback: If AI returns empty boolean string, use the constructed one
    if (!parsedData.generatedBooleanString) {
        parsedData.generatedBooleanString = constructedBoolean;
    }

    parsedData.candidates = parsedData.candidates.map((c, i) => ({
      ...c,
      id: `cand_${i}_${Date.now()}`
    }));
    return parsedData;

  } catch (error) {
    console.error("Candidate Search Error:", error);
    throw new Error("Sökningen misslyckades. Försök att förenkla kriterierna eller kontrollera din anslutning.");
  }
};

export const searchAssignments = async (criteria: SearchCriteria, existingAssignments: Assignment[] = []): Promise<Assignment[]> => {
  const today = new Date().toISOString().split('T')[0];
  const exclusionList = existingAssignments.map(a => a.title).join(', ');
  
  const prompt = `
    Role: B2B Sales Agent for IT Consultants.
    Task: Find active **Consultant Assignments** (Konsultuppdrag) in Sweden.
    Date: ${today}.
    
    TARGET CRITERIA:
    - Role: ${criteria.role}
    - Tech: ${criteria.techStack}
    - Location: ${criteria.location}
    
    SEARCH STRATEGY (Use Google Search):
    1. Search specific Swedish broker sites and job boards:
       - "site:verama.com ${criteria.role} ${criteria.location}"
       - "site:eworkgroup.com ${criteria.role} ${criteria.location}"
       - "site:brainville.com ${criteria.role}"
       - "site:uppdrag.se ${criteria.role}"
       - "site:linkedin.com/jobs ${criteria.role} ${criteria.location} (Konsult OR Contract)"
    2. Look for keywords: "Start omgående", "Timpris", "Konsultuppdrag", "Interim".
    3. **Exclude** listings that say "Tillsvidare", "Fast anställning", "Permanent".
    
    EXTRACTION RULES:
    1. **Active Listings Only**: Prioritize results indexed in the last month.
    2. **Real URLs**: ONLY include a URL if it is explicitly present in the search result snippet (e.g., https://verama.com/jobs/123). DO NOT construct, guess, or hallucinate URLs. If you don't find a direct link, leave "url" as empty string "".
    3. **Source**: Identify where you found it (e.g. "Verama", "LinkedIn", "Ework").
    4. **Client**: If the end-client is hidden (common in brokerage), write "Confidential / Via Broker".
    5. **Description**: Extract a DETAILED description (at least 2-3 sentences). Include specific Tech Stack required, Duration, and Start Date if available.

    Exclude titles: [${exclusionList}]

    Return JSON:
    [
      {
        "title": "string",
        "client": "string",
        "source": "string",
        "url": "string (or empty)",
        "description": "string (Detailed summary with tech stack and duration)",
        "location": "string",
        "deadline": "string",
        "datePosted": "string",
        "isActive": boolean
      }
    ]
  `;

  try {
    const response = await generateContentWithRetry({
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
        systemInstruction: "You are a strict data scraper for B2B assignments. JSON output only. DO NOT HALLUCINATE LINKS.",
      },
    });

    let text = response.text;

    if (!text && response.candidates?.[0]?.content?.parts) {
        text = response.candidates[0].content.parts.map(p => p.text).join('');
    }

    if (!text) throw new Error("Hittade inga uppdrag.");
    
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
    throw new Error("Kunde inte hämta uppdrag just nu. Försök igen eller justera sökningen.");
  }
};

export const performMatchmaking = async (candidates: Candidate[], assignments: Assignment[]): Promise<MatchResult[]> => {
  if (candidates.length === 0 || assignments.length === 0) return [];

  // Limit payload size to avoid token limits
  const candStr = JSON.stringify(candidates.map(c => ({ id: c.id, name: c.name, skills: c.skills, summary: c.summary })));
  const assignStr = JSON.stringify(assignments.map(a => ({ id: a.id, title: a.title, client: a.client, description: a.description, tech: a.description })));

  const prompt = `
    Role: Senior Account Manager.
    Task: Evaluate fit between Consultants and Assignments.
    
    Consultants: ${candStr}
    Assignments: ${assignStr}

    Instructions:
    1. Analyze Technical Skills overlap (Critical).
    2. Analyze Seniority/Experience Level fit.
    3. Return ONLY matches with a score > 60.
    4. Provide specific reasoning in Swedish.

    Return JSON array:
    [
      {
        "assignmentId": "string",
        "candidateId": "string",
        "matchScore": number (0-100),
        "reason": "string",
        "strengths": ["string"],
        "gaps": ["string"]
      }
    ]
  `;

  try {
    const response = await generateContentWithRetry({
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

    if (!text) throw new Error("Matchning misslyckades.");

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