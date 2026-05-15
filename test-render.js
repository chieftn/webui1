import fs from 'node:fs';
import { build, render } from '@microsoft/webui';

const buildResult = build({ appDir: './src', entry: 'index.html', plugin: 'webui', css: 'style' });
const html = render(buildResult.protocol, {
  textdirection: 'ltr', language: 'en', title: 'Test', body: 'Hello',
  items: [], remainingCount: 0,
}, { plugin: 'webui' });

const regex = /<info-card[^>]*><template shadowrootmode="open">([\s\S]*?)<\/template><\/info-card>/;
const match = html.match(regex);
console.log('match found:', !!match);
if (match) {
  console.log('extracted:', match[1].substring(0, 200));
} else {
  // Show area around info-card
  const idx = html.indexOf('info-card');
  console.log('info-card context:', html.substring(idx - 10, idx + 300));
}
