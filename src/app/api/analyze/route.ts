import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type SummaryResponse = {
  title: string;
  mainPoints: string[];
  overallSummary: string;
  documentType: string;
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

    const summarySchema = {
      type: "object",
      properties: {
        title: { type: "string" },
        mainPoints: {
          type: "array",
          items: { type: "string" },
        },
        overallSummary: { type: "string" },
        documentType: { type: "string" },
      },
      required: ["title", "mainPoints", "overallSummary", "documentType"],
    } as const;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You will analyze a document and return a JSON summary.

Rules:
- Use clear, simple language.
- 3–5 main bullet points.
- One short overall summary paragraph.
- Guess documentType (e.g. "contract", "privacy policy", "terms of service", "other").
          `.trim(),
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64,
              },
            },
          ],
        },
      ],
      config: {
        // Setting temperature low (e.g., 0.2) encourages factual and deterministic output
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: summarySchema,
        //         systemInstruction: {
        //           parts: [
        //             {
        //               text: `
        //               You are an expert text analysis and summarization specialist. Your task is to carefully read the provided document and generate a concise yet comprehensive summary.

        // Formatting and Style Rules:
        // 1.  **Length:** The final summary must not exceed 300 words.
        // 2.  **Tone:** Use an objective and professional tone.
        // 3.  **Format:** Present the summary using a short list of 3-5 main bullet points, followed by a concluding general paragraph.
        // 4.  **Attention:** Retain specific domain terminology found in the document.
        // 5.  **Output:** Respond **only** with the summary, without any additional introductions or personal commentary.
        // `,
        //             },
        //           ],
        //         },
      },
    });

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
