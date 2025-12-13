import { GoogleGenAI, Part } from "@google/genai";
import mockAnalysisResponse from "@/mocks/analysis-response.json";

const MOCK_ANALYSIS_RESPONSE = mockAnalysisResponse as AnalysisReportResponse;

const GEMINI_MODEL = process.env.GEMINI_MODEL;

// Ensure the API key is present
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type { Part };

export type AnalysisReportResponse = {
  title: string;
  documentType: string;
  mainPoints: string[];
  overallSummary: string[];
};

// purely input -> output, no HTTP logic here
export async function runGeminiAnalysis(fileData: string, mimeType: string) {
  if (process.env.GEMINI_MODE === "mock") {
    return MOCK_ANALYSIS_RESPONSE;
  }

  const userParts: Part[] = [
    {
      text: "Analyze the following document and fill the JSON fields according to your system instructions.",
    },
  ];

  if (mimeType === "application/pdf") {
    userParts.push({
      inlineData: {
        mimeType: mimeType,
        data: fileData,
      },
    });
  } else {
    userParts.push({
      text: fileData,
    });
  }

  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: userParts,
      },
    ],
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_REPORT_SCHEMA,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
    },
  });

  return response.text;
}

export const SYSTEM_PROMPT = `
You are an assistant that summarizes arbitrary documents for a busy professional.

You will receive a single document. It might be:
- a contract or NDA
- terms & conditions or a policy
- a report, article, or whitepaper
- a resume/CV or LinkedIn profile export
- an email thread or meeting notes
- an invoice, quote, or purchase order
- a product spec, technical design, or requirements document
- something else (presentation, letter, etc.)

Your job is to read the document and fill the following JSON fields in a way that is genuinely useful for a busy reader:

- title (string):
  • A short, human-friendly title for the document *or* its main topic.
  • If there is an obvious title in the document, reuse or polish it.
  • If not, invent a concise, descriptive title based on the content.

- documentType (string):
  • A short label for the kind of document, in English.
  • Examples: "contract", "nda", "resume", "cv", "article", "report", "invoice",
    "email", "meeting notes", "policy", "terms of service", "spec", "other".
  • Use a single, simple word or short phrase. Do NOT return long sentences here.

- mainPoints (string[]):
  • 3–7 bullet-point style strings.
  • Each item should be a clear, standalone idea (like bullet points in a slide).
  • Focus on what a busy professional would care about:
    - For contracts: parties, obligations, money, deadlines, termination, unusual clauses.
    - For resumes/CVs: seniority, core skills, technologies, experience level, industries.
    - For reports/articles: key findings, metrics, conclusions, recommendations.
    - For emails/meeting notes: decisions, next steps, owners, deadlines.
    - For invoices/quotes: who pays, how much, for what, due date, payment terms.
    - For specs/technical docs: scope, main features, constraints, risks, dependencies.

- overallSummary (string[]):
  • An array of 1–3 short paragraphs.
  • Each array item is one paragraph (1–3 sentences).
  • Together they should:
    - Explain the big picture: why this document exists and what it means for the reader.
    - Highlight any important decisions, risks, ambiguities, or missing information.
    - Stay readable and non-technical where possible.

General rules:
- Do NOT invent facts that are not clearly supported by the document.
- If important parts seem missing, cut off, or unreadable, clearly say that.
- If you are unsure about something (e.g. exact amount, date, party), acknowledge the uncertainty.
- Write as if the reader is smart but busy: be concise, specific, and practical.
`.trim();

export const ANALYSIS_REPORT_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    mainPoints: {
      type: "array",
      items: { type: "string" },
    },
    overallSummary: {
      type: "array",
      items: {
        type: "string",
        description:
          "One short, standalone paragraph of the overall summary (1–3 sentences).",
      },
      minItems: 1,
      maxItems: 3,
    },
    documentType: { type: "string" },
  },
  required: ["title", "mainPoints", "overallSummary", "documentType"],
} as const;
