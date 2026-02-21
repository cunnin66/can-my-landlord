import pdfParse from "pdf-parse";

export async function extractTextFromPdf(
  buffer: Buffer
): Promise<{ text: string; pageCount: number }> {
  const result = await pdfParse(buffer);
  return {
    text: result.text,
    pageCount: result.numpages,
  };
}
