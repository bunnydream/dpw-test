import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "public/images");
const MAX_EDGE = 2400;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 82;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "ORIGINALS") continue;
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return null;

  const before = (await fs.stat(file)).size;
  if (before === 0) {
    console.log(`${path.relative(ROOT, file)}: SKIPPED (0 bytes)`);
    return null;
  }
  const image = sharp(file);
  let metadata;
  try {
    metadata = await image.metadata();
  } catch (err) {
    console.log(`${path.relative(ROOT, file)}: SKIPPED (unreadable: ${err.message})`);
    return null;
  }

  let pipeline = image;
  if (metadata.width && metadata.height && Math.max(metadata.width, metadata.height) > MAX_EDGE) {
    pipeline = pipeline.resize({
      width: metadata.width >= metadata.height ? MAX_EDGE : undefined,
      height: metadata.height > metadata.width ? MAX_EDGE : undefined,
      withoutEnlargement: true,
    });
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  }

  const buffer = await pipeline.toBuffer();
  const after = buffer.length;

  if (after < before) {
    await fs.writeFile(file, buffer);
  }

  return { file, before, after: after < before ? after : before };
}

async function main() {
  const files = await walk(ROOT);
  let totalBefore = 0;
  let totalAfter = 0;
  const results = [];

  for (const file of files) {
    const result = await processFile(file);
    if (!result) continue;
    totalBefore += result.before;
    totalAfter += result.after;
    results.push(result);
    const pct = (100 * (1 - result.after / result.before)).toFixed(0);
    console.log(
      `${path.relative(ROOT, file)}: ${(result.before / 1024).toFixed(0)}KB -> ${(result.after / 1024).toFixed(0)}KB (-${pct}%)`
    );
  }

  console.log("\n--- Summary ---");
  console.log(`Files processed: ${results.length}`);
  console.log(`Total before: ${(totalBefore / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Total after: ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Reduction: ${(100 * (1 - totalAfter / totalBefore)).toFixed(0)}%`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
