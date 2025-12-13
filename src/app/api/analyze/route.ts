import { processFileForGemini } from "@/lib/file-utils";
import { runGeminiAnalysis } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

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

    // prepare file data
    const processedFile = await processFileForGemini(file);

    // business logic
    const analysis = await runGeminiAnalysis(
      processedFile.data,
      processedFile.mimeType
    );

    console.log("analysis in route: ", analysis);

    return NextResponse.json({ analysis });
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
