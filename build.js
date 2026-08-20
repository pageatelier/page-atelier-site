#!/usr/bin/env node
// Syncs the shared header/footer into every page from partials/.
//
// Usage:
//   node build.js         sync all pages
//   node build.js --check exit 1 if any page is out of sync (no writes)
//
// How it works: each page's header/footer/font-links are wrapped in
//   <!-- BUILD:HEADER --> ... <!-- /BUILD:HEADER -->
//   <!-- BUILD:FOOTER --> ... <!-- /BUILD:FOOTER -->
//   <!-- BUILD:FONTS  --> ... <!-- /BUILD:FONTS -->
// This script replaces everything between those markers with the current
// contents of partials/header.html, partials/footer.html and
// partials/fonts-head.html. Deployed output is still plain static HTML —
// this only runs locally before you commit, Cloudflare Pages doesn't need
// to know about it.

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PARTIALS = {
  HEADER: fs.readFileSync(path.join(ROOT, "partials/header.html"), "utf8").trim(),
  FOOTER: fs.readFileSync(path.join(ROOT, "partials/footer.html"), "utf8").trim(),
  FONTS: fs.readFileSync(path.join(ROOT, "partials/fonts-head.html"), "utf8").trim()
};

function findPages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "partials") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findPages(full, out);
    } else if (entry.name === "index.html") {
      out.push(full);
    }
  }
  return out;
}

function syncBlock(html, name, replacement) {
  const startTag = `<!-- BUILD:${name} -->`;
  const endTag = `<!-- /BUILD:${name} -->`;
  const start = html.indexOf(startTag);
  const end = html.indexOf(endTag);

  if (start !== -1 && end !== -1) {
    const before = html.slice(0, start + startTag.length);
    const after = html.slice(end);
    return { html: `${before}\n${replacement}\n${after}`, changed: true };
  }
  return { html, changed: false, missing: true };
}

const checkOnly = process.argv.includes("--check");
const pages = findPages(ROOT);
let outOfSync = [];
let missingMarkers = [];

for (const file of pages) {
  const original = fs.readFileSync(file, "utf8");
  let html = original;

  const header = syncBlock(html, "HEADER", PARTIALS.HEADER);
  html = header.html;
  const footer = syncBlock(html, "FOOTER", PARTIALS.FOOTER);
  html = footer.html;
  const fonts = syncBlock(html, "FONTS", PARTIALS.FONTS);
  html = fonts.html;

  if (header.missing || footer.missing || fonts.missing) {
    missingMarkers.push(path.relative(ROOT, file));
    continue;
  }

  if (html !== original) {
    outOfSync.push(path.relative(ROOT, file));
    if (!checkOnly) fs.writeFileSync(file, html);
  }
}

if (missingMarkers.length) {
  console.log("No BUILD markers found (skipped):");
  missingMarkers.forEach((f) => console.log("  " + f));
}

if (checkOnly) {
  if (outOfSync.length) {
    console.log("Out of sync with partials/:");
    outOfSync.forEach((f) => console.log("  " + f));
    process.exit(1);
  }
  console.log(`All ${pages.length - missingMarkers.length} pages in sync.`);
} else {
  console.log(`Synced ${outOfSync.length} page(s), ${pages.length - outOfSync.length - missingMarkers.length} already up to date.`);
}
