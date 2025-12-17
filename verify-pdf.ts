import { buildReportPdf } from "./src/features/analyze/utils/buildReportPdf";

async function verify() {
  try {
    const mockProps = {
      fileName: "test-document.pdf",
      createdAt: new Date().toISOString(),
      analysis: {
        title: "Test Analysis",
        documentType: "Agreement",
        mainPoints: ["Point 1", "Point 2"],
        overallSummary: ["This is a test summary paragraph."],
      },
    };

    console.log("Generating test PDF...");
    const buffer = await buildReportPdf(mockProps);
    console.log("PDF generated successfully. Buffer length:", buffer.length);
  } catch (error) {
    console.error("PDF generation failed:", error);
    process.exit(1);
  }
}

verify();
