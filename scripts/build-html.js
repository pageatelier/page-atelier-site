#!/usr/bin/env node
/**
 * Assembles the static HTML pages from src/pages/*.html templates and the
 * shared chrome in src/partials/*.html (header, mobile menu, footer,
 * kakao-float, skip link). Output is plain static HTML written to the
 * project root — no runtime include mechanism, no build step required to
 * view the deployed site.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PARTIALS_DIR = path.join(ROOT, 'src', 'partials');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');

const NAV_ACTIVE_CLASS =
  "relative py-[9px] text-xs font-semibold uppercase tracking-[0.07em] text-ink after:absolute after:bottom-[5px] after:left-0 after:right-0 after:h-px after:origin-left after:scale-x-100 after:bg-ink after:transition-transform after:duration-[350ms] after:ease-[cubic-bezier(0.2,0.75,0.25,1)] after:content-['']";
const NAV_INACTIVE_CLASS =
  "group relative py-[9px] text-xs font-semibold uppercase tracking-[0.07em] text-ink-soft after:absolute after:bottom-[5px] after:left-0 after:right-0 after:h-px after:origin-right after:scale-x-0 after:bg-ink after:transition-transform after:duration-[350ms] after:ease-[cubic-bezier(0.2,0.75,0.25,1)] after:content-[''] hover:after:origin-left hover:after:scale-x-100";

const NAV_KEYS = ['about', 'works', 'services', 'contact'];

// Per-page config: which nav item is active, and where the header CTA points.
const PAGES = [
  { file: 'index.html', active: 'about', ctaHref: 'contact.html' },
  { file: 'works.html', active: 'works', ctaHref: 'contact.html' },
  { file: 'services.html', active: 'services', ctaHref: 'contact.html' },
  { file: 'contact.html', active: 'contact', ctaHref: '#inquiry' },
];

function readPartial(name) {
  return fs.readFileSync(path.join(PARTIALS_DIR, `${name}.html`), 'utf8').trim();
}

function renderHeader(activeKey, ctaHref) {
  let html = readPartial('header');
  for (const key of NAV_KEYS) {
    const cls = key === activeKey ? NAV_ACTIVE_CLASS : NAV_INACTIVE_CLASS;
    html = html.split(`{{CLASS:${key}}}`).join(cls);
  }
  return html.split('{{HREF:cta}}').join(ctaHref);
}

const staticIncludes = {
  'skip-link': readPartial('skip-link'),
  'mobile-menu': readPartial('mobile-menu'),
  footer: readPartial('footer'),
  'kakao-float': readPartial('kakao-float'),
};

for (const page of PAGES) {
  const templatePath = path.join(PAGES_DIR, page.file);
  let html = fs.readFileSync(templatePath, 'utf8');

  const includes = {
    ...staticIncludes,
    header: renderHeader(page.active, page.ctaHref),
  };

  html = html.replace(/<!--@include ([\w-]+)-->/g, (match, name) => {
    if (!(name in includes)) {
      throw new Error(`Unknown include "${name}" in ${page.file}`);
    }
    return includes[name];
  });

  fs.writeFileSync(path.join(ROOT, page.file), html);
  console.log(`built ${page.file}`);
}
