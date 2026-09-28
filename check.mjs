import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve('dist');
const html = readFileSync(resolve(root,'index.html'),'utf8');
const css = readFileSync(resolve(root,'style.css'),'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate element IDs');
for (const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if(url.startsWith('#')) assert.ok(ids.includes(url.slice(1)),`Missing anchor: ${url}`);
  else if(!/^(https?:|mailto:|data:)/.test(url)) assert.ok(existsSync(resolve(root,url)),`Missing file: ${url}`);
}
for(const [,url] of css.matchAll(/url\('([^']+)'\)/g)) assert.ok(existsSync(resolve(root,url)),`Missing CSS asset: ${url}`);
for(const project of ['ThreatLeans','PhishGuard','AI-IDS','cal']) assert.ok(html.includes(`https://github.com/Girijesh94/${project}`));
assert.ok(html.includes('mailto:iamgirijesh@gmail.com'));
assert.ok(!/Jishnu|rickmondal|500\+|20\+/.test(html),'Reference identity or unsupported claims remain');
assert.ok(css.includes('prefers-reduced-motion'));
console.log('Passed: unique IDs, navigation anchors, local assets, four project links, email, personalized content, and reduced-motion rules.');
