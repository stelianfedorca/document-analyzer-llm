import type { DocumentRecord } from "@/types/firestore";

export type Props = Pick<DocumentRecord, "fileName" | "createdAt" | "analysis">;

function formatDocType(docType?: string) {
  if (!docType) return undefined;
  return docType.charAt(0).toUpperCase() + docType.slice(1);
}

function formatDate(isoDate?: string) {
  if (!isoDate) return undefined;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getReportParts({ fileName, createdAt, analysis }: Props) {
  const title = analysis?.title || "Summary";
  const docTypeLabel = formatDocType(analysis?.documentType);
  const formattedDate = formatDate(createdAt);

  const mainPoints = (analysis?.mainPoints ?? [])
    .map((point) => point.trim())
    .filter(Boolean);
  const summary = (analysis?.overallSummary ?? [])
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return {
    title,
    docTypeLabel,
    formattedDate,
    fileName,
    mainPoints,
    summary,
  };
}

export function buildReportText(props: Props) {
  const { title, docTypeLabel, formattedDate, fileName, mainPoints, summary } =
    getReportParts(props);

  const mainPointLines =
    mainPoints.length > 0
      ? mainPoints.map((point) => `- ${point}`)
      : ["- (No main points available)"];
  const summaryLines =
    summary.length > 0 ? summary : ["(No summary available)"];

  const lines: Array<string | undefined> = [
    title,
    docTypeLabel ? `Document type: ${docTypeLabel}` : undefined,
    fileName ? `File: ${fileName}` : undefined,
    formattedDate ? `Analyzed: ${formattedDate}` : undefined,
    "",
    "Main Points:",
    ...mainPointLines,
    "",
    "Overall Summary:",
    ...summaryLines,
  ];

  return lines.filter((line): line is string => line !== undefined).join("\n");
}

export function buildReportHtml(props: Props) {
  const { title, docTypeLabel, formattedDate, fileName, mainPoints, summary } =
    getReportParts(props);

  const mainPointItems =
    mainPoints.length > 0
      ? mainPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")
      : "<li>(No main points available)</li>";
  const summaryParagraphs =
    summary.length > 0
      ? summary
          .map(
            (paragraph) =>
              `<p style="margin:0 0 8px 0;">${escapeHtml(paragraph)}</p>`
          )
          .join("")
      : '<p style="margin:0 0 8px 0;">(No summary available)</p>';

  const lines: Array<string | undefined> = [
    `<h1 style="margin:0 0 12px 0;text-align:left;">${escapeHtml(title)}</h1>`,
    docTypeLabel
      ? `<p style="margin:0 0 8px 0;"><strong>Document type:</strong> ${escapeHtml(docTypeLabel)}</p>`
      : undefined,
    fileName
      ? `<p style="margin:0 0 8px 0;"><strong>File:</strong> ${escapeHtml(fileName)}</p>`
      : undefined,
    formattedDate
      ? `<p style="margin:0 0 12px 0;"><strong>Analyzed:</strong> ${escapeHtml(formattedDate)}</p>`
      : undefined,
    '<h2 style="margin:16px 0 8px 0;text-align:left;">Main Points</h2>',
    `<ul style="margin:0 0 12px 20px;padding:0;">${mainPointItems}</ul>`,
    '<h2 style="margin:16px 0 8px 0;text-align:left;">Overall Summary</h2>',
    summaryParagraphs,
  ];

  return lines.filter((line): line is string => line !== undefined).join("");
}
