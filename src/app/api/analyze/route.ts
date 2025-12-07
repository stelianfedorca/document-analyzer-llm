import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Part } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type SummaryResponse = {
  title: string;
  documentType: string;
  mainPoints: string[];
  overallSummary: string[];
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      // bad request - the server thinks the client request is invalid
      // 4xx is for client errors
      return NextResponse.json(
        {
          error: "No file provided",
        },
        { status: 400 }
      );
    }

    let base64 = "";
    let textContent = "";

    // parse pdf
    if (file.type === "application/pdf") {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      base64 = Buffer.from(buffer).toString("base64");
    } else if (file.type?.startsWith("text/")) {
      // parse text
      textContent = await file.text();
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        {
          status: 400,
        }
      );
    }
    console.log("textContent: ", textContent);

    //     const systemPrompt =
    //       `You are an AI assistant that analyzes legal-style documents (contracts, NDAs, terms, policies) for a non-lawyer user.
    //         Your goals:
    //         1) Explain what the document does in clear, simple language.
    //         2) Identify important obligations, deadlines, and financial terms.
    //         3) Highlight risks, asymmetries, and “gotchas” that a reasonable person should know before signing.
    //         4) Suggest concrete negotiation points or questions to ask a lawyer.

    //         General rules:
    //         - You are NOT a lawyer and do NOT give formal legal advice. Repeatedly remind the user to consult a qualified attorney for important decisions.
    //         - Be conservative: if something is ambiguous or you are not sure, clearly say “this is unclear, you should ask a lawyer”.
    //         - Prefer short, precise sentences over long paragraphs.
    //         - Avoid hallucinating: only mention terms and numbers that actually appear in the document.
    //         - When you reference a clause, include a short quote or paraphrase from the document so the user can find it.
    //         - Output MUST be valid JSON only (no extra text, no explanations outside JSON).`.trim();

    //     const userPrompt = `
    //     Analyze the following document and return a JSON object with this exact shape:
    // {
    //   "summary": {
    //     "one_sentence": string,
    //     "short_overview": string,
    //     "parties": string[],
    //     "document_type": string,
    //     "key_obligations": string[],
    //     "key_benefits_for_user": string[]
    //   },
    //   "risks": [
    //     {
    //       "id": string,
    //       "title": string,
    //       "severity": "low" | "medium" | "high",
    //       "category": string,
    //       "detail": string,
    //       "who_it_affects": string,
    //       "clause_snippet": string,
    //       "suggested_mitigation": string
    //     }
    //   ],
    //   "deadlines_and_terms": [
    //     {
    //       "id": string,
    //       "type": "term_length" | "renewal" | "notice_period" | "payment" | "other",
    //       "description": string,
    //       "date_or_period": string,
    //       "clause_snippet": string
    //     }
    //   ],
    //   "financial_terms": {
    //     "pricing_model": string,
    //     "amounts_mentioned": string[],
    //     "extra_fees_or_penalties": string[],
    //     "refund_or_cancellation_rules": string
    //   },
    //   "negotiation_suggestions": string[],
    //   "questions_to_ask_lawyer": string[]
    // }

    // Important:
    // - If you cannot fill a field, use an empty string "" or an empty array [].
    // - Do not invent parties, amounts, or dates that are not present in the document.
    // - Do not add extra top-level fields.
    // - Return ONLY the JSON object, no backticks, no explanation.

    // Document metadata (may be empty):
    // - File name: ${file.name}
    // - User context (may be empty): "N/A"

    // Document content:
    // ---
    // ${textContent}
    // ---
    // `.trim();

    // const completion = await openai.chat.completions.create({
    //   model: "gpt-5-mini",
    //   response_format: { type: "json_object" }, // ✅ valid here
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are a helpful document analyzer. Summarize the key points.",
    //     },
    //     { role: "user", content: textContent },
    //   ],
    // });

    // console.info({ completion });

    // const content = completion.choices[0]?.message?.content;

    // if (!content) {
    //   return NextResponse.json(
    //     { error: "No content returned from model." },
    //     { status: 500 }
    //   );
    // }

    // return NextResponse.json({ analysis: content });

    const systemPrompt = `
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
    const summarySchema = {
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

    const userParts: Part[] = [
      {
        text: "Analyze the following document and fill the JSON fields according to your system instructions.",
      },
    ];

    if (file.type === "application/pdf") {
      userParts.push({
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      });
    } else {
      userParts.push({
        text: textContent,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: userParts,
        },
      ],
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: summarySchema,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      },
    });

    console.log(response.text);

    return NextResponse.json({ analysis: response.text });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal error" },
      {
        status: 500,
      }
    );
  }
}

/**
 * 
 * - overallSummary (string):
  • 1–2 short paragraphs that tie everything together.
  • Explain the big picture: why this document exists and what it means for the reader.
  • Highlight any risks, ambiguities, missing information, or important decisions.
  • Use simple, non-legal, non-jargon-heavy language whenever possible.
 */
