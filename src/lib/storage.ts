import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
});

const bucketName = process.env.GCS_BUCKET_NAME || "can-my-landlord-leases";
const bucket = storage.bucket(bucketName);

export async function uploadPdf(
  documentId: string,
  buffer: Buffer
): Promise<void> {
  const file = bucket.file(`leases/${documentId}.pdf`);
  await file.save(buffer, { contentType: "application/pdf" });
}

export async function uploadExtractedText(
  documentId: string,
  text: string
): Promise<void> {
  const file = bucket.file(`leases/${documentId}.txt`);
  await file.save(text, { contentType: "text/plain" });
}

export async function getExtractedText(
  documentId: string
): Promise<string | null> {
  const file = bucket.file(`leases/${documentId}.txt`);
  const [exists] = await file.exists();
  if (!exists) return null;
  const [content] = await file.download();
  return content.toString("utf-8");
}
