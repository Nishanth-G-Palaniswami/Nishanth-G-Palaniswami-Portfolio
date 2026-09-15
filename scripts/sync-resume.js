// Pulls the public Google Drive copy of the resume into public/resume.pdf.
// Drive is where the resume is edited; the site serves this copy at /resume.pdf.
// Update loop: replace the file in Drive with "Manage versions" (keeps the file
// ID; a fresh upload changes it), then `npm run resume`, commit, push.

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DRIVE_FILE_ID = "1xSsXeuJOPBaVGLctq1r0azfFToLEzv9L";
const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;
const OUT_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "resume.pdf",
);
// Drive answers a bad ID or a private file with a small HTML page, not a PDF.
const MIN_BYTES = 10 * 1024;
const PDF_MAGIC = Buffer.from("%PDF-");

const sha8 = (bytes) => createHash("sha256").update(bytes).digest("hex").slice(0, 8);

async function downloadFromDrive() {
  const res = await fetch(DOWNLOAD_URL, { redirect: "follow" });
  if (res.status !== 200) {
    throw new Error(`Drive returned HTTP ${res.status} for file ${DRIVE_FILE_ID}`);
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "unknown";
  if (bytes.length < MIN_BYTES) {
    throw new Error(
      `Drive returned ${bytes.length} bytes (${contentType}), not a PDF. ` +
        `Is file ${DRIVE_FILE_ID} still shared with "anyone with the link"?`,
    );
  }
  if (!bytes.subarray(0, PDF_MAGIC.length).equals(PDF_MAGIC)) {
    throw new Error(
      `Drive returned ${contentType} content without a %PDF- header. ` +
        `Is file ${DRIVE_FILE_ID} still shared with "anyone with the link"?`,
    );
  }
  return bytes;
}

async function readCurrent() {
  try {
    return await readFile(OUT_PATH);
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

async function main() {
  const fresh = await downloadFromDrive();
  const current = await readCurrent();
  const rel = path.relative(process.cwd(), OUT_PATH);

  if (current !== null && current.equals(fresh)) {
    console.log(`unchanged: ${rel} already matches Drive (${sha8(fresh)}, ${fresh.length} bytes)`);
    return;
  }

  await writeFile(OUT_PATH, fresh);
  const before = current === null ? "none" : sha8(current);
  console.log(`updated: ${rel} ${before} to ${sha8(fresh)}, ${fresh.length} bytes`);
  console.log('next: git add public/resume.pdf; git commit -m "resume: sync from Drive"; git push origin main');
}

try {
  await main();
} catch (err) {
  console.error(`sync-resume failed: ${err instanceof Error ? err.message : String(err)}`);
  // Set the code instead of calling process.exit(): on Windows, exiting while
  // the fetch socket is still closing trips a libuv assertion in Node 24.
  process.exitCode = 1;
}
