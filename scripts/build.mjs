// STRYV · build de la landing bilingüe.
// Fuente única: src/index.html (español + diccionario I18N). Salida: dist/
//   dist/index.html      → https://stryvstudio.com/     (es, x-default)
//   dist/en/index.html   → https://stryvstudio.com/en/  (en)
//   dist/sitemap.xml, dist/robots.txt, dist/assets/**
// Sin dependencias: sólo módulos de Node. Determinista: misma entrada, mismos bytes.
// Sólo se reescriben los nodos marcados con data-i18n*, los metadatos del <head>
// y el conmutador; el resto del HTML se copia tal cual.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://stryvstudio.com';
const LANGS = {
  es: { path: '/', file: 'index.html', ogLocale: 'es_ES' },
  en: { path: '/en/', file: 'en/index.html', ogLocale: 'en_US' },
};
const DEFAULT_LANG = 'es';
const url = lang => SITE + LANGS[lang].path;

const fail = msg => { console.error('build: ' + msg); process.exit(1); };
const src = readFileSync(join(ROOT, 'src/index.html'), 'utf8');

// ── Diccionario: se lee del propio script de la página (una sola fuente) ──
const dictStart = src.indexOf('const I18N = {');
const dictEnd = src.indexOf('\n};\n', dictStart);
if (dictStart < 0 || dictEnd < 0) fail('no se encontró el diccionario I18N');
const I18N = vm.runInNewContext('(' + src.slice(dictStart + 'const I18N = '.length, dictEnd + 2) + ')');
const lookup = (lang, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), I18N[lang]);
const t = (lang, key) => {
  const v = lookup(lang, key);
  if (typeof v !== 'string') fail(`falta la clave "${key}" en "${lang}"`);
  return v;
};
const escText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = s => escText(s).replace(/"/g, '&quot;');

// ── Nodos traducibles del <body>: etiquetas balanceadas, fuera de <script>/<style> ──
function translateBody(html, lang) {
  const bodyStart = html.indexOf('<body');
  const skip = [];
  for (const m of html.matchAll(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi)) skip.push([m.index, m.index + m[0].length]);
  const inSkip = i => skip.some(([a, b]) => i >= a && i < b);
  const edits = [];
  const openRe = /<([a-zA-Z][a-zA-Z0-9]*)\b([^<>]*)>/g;
  openRe.lastIndex = bodyStart;
  let m, count = 0;
  while ((m = openRe.exec(html))) {
    if (inSkip(m.index) || !/\sdata-i18n(-html|-attr)?="/.test(m[2])) continue;
    const tag = m[1].toLowerCase();
    let open = m[0];
    // Atributos: data-i18n-attr="attr:clave;attr:clave"
    const attrSpec = /\sdata-i18n-attr="([^"]+)"/.exec(open);
    if (attrSpec) for (const pair of attrSpec[1].split(';')) {
      const [attr, key] = pair.split(':').map(x => x.trim());
      const value = escAttr(t(lang, key));
      const re = new RegExp(`(\\s${attr}=")[^"]*(")`);
      if (!re.test(open)) fail(`<${tag}> sin atributo ${attr} para ${key}`);
      open = open.replace(re, `$1${value}$2`);
    }
    if (open !== m[0]) edits.push([m.index, m.index + m[0].length, open]);
    // Contenido: data-i18n (texto) o data-i18n-html (HTML propio del diccionario)
    const textKey = /\sdata-i18n="([^"]+)"/.exec(m[0]);
    const htmlKey = /\sdata-i18n-html="([^"]+)"/.exec(m[0]);
    if (textKey || htmlKey) {
      const innerStart = m.index + m[0].length;
      let depth = 1, i = innerStart, innerEnd = -1;
      const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
      tagRe.lastIndex = innerStart;
      let x;
      while ((x = tagRe.exec(html))) {
        depth += x[1] ? -1 : 1;
        if (depth === 0) { innerEnd = x.index; break; }
      }
      if (innerEnd < 0) fail(`<${tag}> sin cierre para ${(textKey || htmlKey)[1]}`);
      const inner = textKey ? escText(t(lang, textKey[1])) : t(lang, htmlKey[1]);
      edits.push([innerStart, innerEnd, inner]);
    }
    count++;
  }
  edits.sort((a, b) => b[0] - a[0]);
  for (let k = 1; k < edits.length; k++) if (edits[k][1] > edits[k - 1][0]) fail('ediciones solapadas en el body');
  for (const [a, b, r] of edits) html = html.slice(0, a) + r + html.slice(b);
  return { html, count };
}

// ── <head>: lang, title, description, canonical, hreflang, OG, X y JSON-LD ──
function localizeHead(html, lang) {
  const once = (re, rep, what) => { if (!re.test(html)) fail(`no se encontró ${what}`); html = html.replace(re, rep); };
  once(/<html lang="[^"]*">/, `<html lang="${lang}">`, '<html lang>');
  once(/<title>[^<]*<\/title>/, `<title>${escText(t(lang, 'meta.title'))}</title>`, '<title>');
  once(/(<meta name="description" content=")[^"]*(">)/, `$1${escAttr(t(lang, 'meta.description'))}$2`, 'meta description');
  const alternates = [...Object.keys(LANGS).map(l => `<link rel="alternate" hreflang="${l}" href="${url(l)}">`),
    `<link rel="alternate" hreflang="x-default" href="${url(DEFAULT_LANG)}">`].join('\n');
  once(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url(lang)}">\n${alternates}`, 'canonical');
  once(/(<meta property="og:url" content=")[^"]*(">)/, `$1${url(lang)}$2`, 'og:url');
  once(/(<meta property="og:title" content=")[^"]*(">)/, `$1${escAttr(t(lang, 'meta.title'))}$2`, 'og:title');
  once(/(<meta property="og:description" content=")[^"]*(">)/, `$1${escAttr(t(lang, 'meta.description'))}$2`, 'og:description');
  const otherLocales = Object.keys(LANGS).filter(l => l !== lang).map(l => `\n<meta property="og:locale:alternate" content="${LANGS[l].ogLocale}">`).join('');
  once(/(<meta property="og:site_name" content="[^"]*">)/, `$1\n<meta property="og:locale" content="${LANGS[lang].ogLocale}">${otherLocales}`, 'og:site_name');
  once(/(<meta name="twitter:title" content=")[^"]*(">)/, `$1${escAttr(t(lang, 'meta.title'))}$2`, 'twitter:title');
  once(/(<meta name="twitter:description" content=")[^"]*(">)/, `$1${escAttr(t(lang, 'meta.description'))}$2`, 'twitter:description');
  once(/<!-- Open Graph \/ X: [^>]*-->/, '<!-- Open Graph / X: generados por idioma en el build -->', 'comentario OG');
  const ldRe = /(<script type="application\/ld\+json">\n)([\s\S]*?)(\n<\/script>)/;
  const ldM = ldRe.exec(html); if (!ldM) fail('no se encontró el JSON-LD');
  const ld = JSON.parse(ldM[2]);
  for (const node of ld['@graph']) {
    if (node['@type'] === 'Organization') node.description = t(lang, 'meta.orgDescription');
    if (node['@type'] === 'WebSite') node.inLanguage = lang;
  }
  html = html.replace(ldRe, `$1${JSON.stringify(ld, null, 2)}$3`);
  return html;
}

// ── Conmutador: estado del idioma de la página ──
function localizeSwitch(html, lang) {
  return html.replace(/<a class="lang-btn" ([^>]*?)( aria-current="page")?>/g, (all, attrs) => {
    const l = /data-lang="([a-z]+)"/.exec(attrs)[1];
    return `<a class="lang-btn" ${attrs}${l === lang ? ' aria-current="page"' : ''}>`;
  });
}

// ── Build ──
if (existsSync(DIST)) rmSync(DIST, { recursive: true });
mkdirSync(DIST, { recursive: true });
const report = [];
for (const lang of Object.keys(LANGS)) {
  let html = localizeHead(src, lang);
  const body = translateBody(html, lang);
  html = localizeSwitch(body.html, lang);
  const out = join(DIST, LANGS[lang].file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  report.push(`${lang}: ${LANGS[lang].file} · ${body.count} nodos traducidos · ${html.length} bytes`);
}
const links = Object.keys(LANGS).map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(l)}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${url(DEFAULT_LANG)}"/>`).join('\n');
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.keys(LANGS).map(l => `  <url>\n    <loc>${url(l)}</loc>\n${links}\n  </url>`).join('\n')}
</urlset>
`);
cpSync(join(ROOT, 'robots.txt'), join(DIST, 'robots.txt'));
// Aviso de privacidad: páginas estáticas, una por idioma.
mkdirSync(join(DIST, 'privacidad'), { recursive: true });
mkdirSync(join(DIST, 'en', 'privacy'), { recursive: true });
cpSync(join(ROOT, 'src/legal/privacidad.html'), join(DIST, 'privacidad/index.html'));
cpSync(join(ROOT, 'src/legal/privacy.html'), join(DIST, 'en/privacy/index.html'));
// Propuesta de rediseño (sólo en esta rama): /diseno/vivo/.
if (existsSync(join(ROOT, 'src/diseno/vivo.html'))) {
  mkdirSync(join(DIST, 'diseno', 'vivo'), { recursive: true });
  cpSync(join(ROOT, 'src/diseno/vivo.html'), join(DIST, 'diseno/vivo/index.html'));
}
// assets/videos/ son los originales viejos (cientos de MB) que la página ya no usa: no se publican.
cpSync(join(ROOT, 'assets'), join(DIST, 'assets'), { recursive: true, filter: p => !p.startsWith(join(ROOT, 'assets', 'videos')) });
console.log(report.join('\n') + '\nsitemap.xml · robots.txt · assets/ → dist/');
