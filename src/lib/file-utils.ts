export async function processFileForGemini(file: File) {
  const arrayBuffer = await file.arrayBuffer();

  if (file.type === "application/pdf") {
    const buffer = Buffer.from(arrayBuffer);
    return {
      mimeType: "application/pdf",
      data: buffer.toString("base64"),
      isBinary: true,
    };
  }

  if (file.type.startsWith("text/")) {
    const textDecoder = new TextDecoder();
    return {
      mimeType: "text/plain",
      data: textDecoder.decode(arrayBuffer),
      isBinary: false,
    };
  }
  throw new Error("Unsupported file type");
}
