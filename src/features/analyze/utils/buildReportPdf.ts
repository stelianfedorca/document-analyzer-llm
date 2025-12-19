import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { buildReportParts, type Props } from "./buildReportText";
import { ReportDocument } from "../components/ReportDocument/ReportDocument";

/**
 * Generates a PDF buffer using @react-pdf/renderer.
 * This function is designed to run in a Node.js environment (Next.js API Routes).
 */
export async function buildReportPdf(props: Props): Promise<Buffer> {
  const parts = buildReportParts(props);

  // renderToBuffer is a Node-only method from @react-pdf/renderer
  // It returns a Promise<Buffer>
  const buffer = await renderToBuffer(
    React.createElement(ReportDocument, parts)
  );

  return buffer;
}
