import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    let textContent = "";

    // parse pdf
    if (file.type === "application/pdf") {
      // Convert File to Buffer for pdf-parse
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const parser = new PDFParse({ data: buffer });
      const { text } = await parser.getText();
      await parser.destroy();
      textContent = text;
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

    const systemPrompt =
      `You are an AI assistant that analyzes legal-style documents (contracts, NDAs, terms, policies) for a non-lawyer user.
        Your goals:
        1) Explain what the document does in clear, simple language.
        2) Identify important obligations, deadlines, and financial terms.
        3) Highlight risks, asymmetries, and “gotchas” that a reasonable person should know before signing.
        4) Suggest concrete negotiation points or questions to ask a lawyer.

        General rules:
        - You are NOT a lawyer and do NOT give formal legal advice. Repeatedly remind the user to consult a qualified attorney for important decisions.
        - Be conservative: if something is ambiguous or you are not sure, clearly say “this is unclear, you should ask a lawyer”.
        - Prefer short, precise sentences over long paragraphs.
        - Avoid hallucinating: only mention terms and numbers that actually appear in the document.
        - When you reference a clause, include a short quote or paraphrase from the document so the user can find it.
        - Output MUST be valid JSON only (no extra text, no explanations outside JSON).`.trim();

    const userPrompt = `
    Analyze the following document and return a JSON object with this exact shape:
{
  "summary": {
    "one_sentence": string,
    "short_overview": string,
    "parties": string[],
    "document_type": string,
    "key_obligations": string[],
    "key_benefits_for_user": string[]
  },
  "risks": [
    {
      "id": string,
      "title": string,
      "severity": "low" | "medium" | "high",
      "category": string,
      "detail": string,
      "who_it_affects": string,
      "clause_snippet": string,
      "suggested_mitigation": string
    }
  ],
  "deadlines_and_terms": [
    {
      "id": string,
      "type": "term_length" | "renewal" | "notice_period" | "payment" | "other",
      "description": string,
      "date_or_period": string,
      "clause_snippet": string
    }
  ],
  "financial_terms": {
    "pricing_model": string,
    "amounts_mentioned": string[],
    "extra_fees_or_penalties": string[],
    "refund_or_cancellation_rules": string
  },
  "negotiation_suggestions": string[],
  "questions_to_ask_lawyer": string[]
}

Important:
- If you cannot fill a field, use an empty string "" or an empty array [].
- Do not invent parties, amounts, or dates that are not present in the document.
- Do not add extra top-level fields.
- Return ONLY the JSON object, no backticks, no explanation.

Document metadata (may be empty):
- File name: ${file.name}
- User context (may be empty): "N/A"

Document content:
---
${textContent}
---
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      response_format: { type: "json_object" }, // ✅ valid here
      messages: [
        {
          role: "system",
          content:
            "You are a helpful document analyzer. Summarize the key points.",
        },
        { role: "user", content: textContent },
      ],
    });

    console.info({ completion });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content returned from model." },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis: content });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}
