#!/usr/bin/env node
// Render an HTML carousel / guide into PNG slides + one multi-page PDF.
//
//   node render.mjs <file.html> [--out DIR] [--png] [--pdf] [--scale 1|2] [--name NAME] [--chrome PATH]
//   node render.mjs --images DIR [--out DIR] [--name NAME]      (combine existing PNG/JPG slides into one PDF)
//
// Every page in the HTML is a <section class="slide">. Page size is read from the
// first slide (1080x1350 for 4:5 carousels, 1080x1920 for 9:16, 1240x1754 for A4 guides).
// Default: both PNG and PDF. Output names: slide-01.png ... and <name>.pdf

import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d;
};
const VALUE_OPTS = ["out", "scale", "name", "chrome", "images"];
const positional = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && VALUE_OPTS.includes(args[i - 1].slice(2))));

function loadPlaywright() {
  const roots = [process.cwd(), path.dirname(fileURLToPath(import.meta.url))];
  try { roots.push(execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim()); } catch {}
  for (const root of roots) {
    const req = createRequire(path.join(root, "noop.js"));
    for (const name of ["playwright", "playwright-core", path.join(root, "playwright"), path.join(root, "playwright-core")]) {
      try { return req(name); } catch {}
    }
  }
  console.error("Playwright not found. Install once:  npm i -g playwright  &&  npx playwright install chromium");
  process.exit(1);
}

const { chromium } = loadPlaywright();
const chromePath = opt("chrome", process.env.CHROME_PATH);
const browser = await chromium.launch(chromePath ? { executablePath: chromePath } : {});

try {
  if (opt("images")) await imagesToPdf(opt("images"));
  else await renderHtml(positional[0]);
} finally {
  await browser.close();
}

async function renderHtml(file) {
  if (!file || !fs.existsSync(file)) {
    console.error("Usage: node render.mjs <file.html> [--out DIR] [--png] [--pdf] [--scale 2]");
    process.exit(1);
  }
  const abs = path.resolve(file);
  const outDir = path.resolve(opt("out", path.join(path.dirname(abs), "final")));
  const name = opt("name", path.basename(abs, ".html"));
  const scale = Number(opt("scale", "1"));
  const wantPng = flag("png") || !flag("pdf");
  const wantPdf = flag("pdf") || !flag("png");
  fs.mkdirSync(outDir, { recursive: true });

  const page = await browser.newPage({ deviceScaleFactor: scale });
  await page.goto(pathToFileURL(abs).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const slides = await page.$$("section.slide");
  if (!slides.length) throw new Error('No <section class="slide"> found');
  const box = await slides[0].boundingBox();
  const w = Math.round(box.width), h = Math.round(box.height);
  await page.setViewportSize({ width: w, height: h });

  // Fail loudly on overflow: text that spills out of a slide is the #1 silent bug.
  const overflow = await page.evaluate(() =>
    [...document.querySelectorAll("section.slide")].flatMap((s, i) =>
      [...s.querySelectorAll("*")]
        .filter((el) => {
          const r = el.getBoundingClientRect(), b = s.getBoundingClientRect();
          return el.closest("[data-bleed]") == null && (r.right > b.right + 1 || r.left < b.left - 1 || r.bottom > b.bottom + 1 || r.top < b.top - 1);
        })
        .slice(0, 3)
        .map((el) => `slide ${i + 1}: <${el.tagName.toLowerCase()} class="${el.className}"> overflows`)
    )
  );
  overflow.forEach((m) => console.warn("WARN", m));

  if (wantPng) {
    for (let i = 0; i < slides.length; i++) {
      const f = path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
      await slides[i].screenshot({ path: f });
      console.log("png ", f);
    }
  }
  if (wantPdf) {
    await page.emulateMedia({ media: "print" });
    const f = path.join(outDir, `${name}.pdf`);
    await page.pdf({ path: f, width: `${w}px`, height: `${h}px`, printBackground: true, preferCSSPageSize: false, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log("pdf ", f, `(${slides.length} pages, ${w}x${h})`);
  }
}

async function imagesToPdf(dir) {
  const abs = path.resolve(dir);
  const files = fs.readdirSync(abs).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (!files.length) throw new Error(`No images in ${abs}`);
  const outDir = path.resolve(opt("out", abs));
  const name = opt("name", "carousel");
  const page = await browser.newPage();
  const html = `<!doctype html><html><head><style>@page{margin:0}html,body{margin:0;background:#000}img{display:block;width:100vw;height:100vh;object-fit:contain;break-after:page}</style></head><body>${files
    .map((f) => `<img src="${pathToFileURL(path.join(abs, f)).href}">`)
    .join("")}</body></html>`;
  const tmp = path.join(abs, ".pdf-tmp.html");
  fs.writeFileSync(tmp, html);
  try {
    await page.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
    const [w, h] = await page.evaluate(() => [document.images[0].naturalWidth, document.images[0].naturalHeight]);
    await page.setViewportSize({ width: w, height: h });
    fs.mkdirSync(outDir, { recursive: true });
    const f = path.join(outDir, `${name}.pdf`);
    await page.pdf({ path: f, width: `${w}px`, height: `${h}px`, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log("pdf ", f, `(${files.length} pages, ${w}x${h})`);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}
