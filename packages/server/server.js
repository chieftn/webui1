import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { render } from '@microsoft/webui';

const require = createRequire(import.meta.url);

// Resolve paths from the @webui1/components package
const componentsDir = path.dirname(require.resolve('@webui1/components/package.json'));
const protocol = fs.readFileSync(path.join(componentsDir, 'dist', 'protocol.bin'));
const publicDir = path.join(componentsDir, 'public');

const app = express();
const PORT = 3000;

// Serve static assets (JS bundle) from the components package
app.use(express.static(publicDir));

// Load state
const state = JSON.parse(fs.readFileSync('./data/state.json', 'utf-8'));

// Main page — full SSR with DSD
app.get('/', (req, res) => {
  const html = render(protocol, state, { plugin: 'webui' });
  res.type('html').send(html);
});

// API endpoint — render a component via WebUI and return downleveled HTML
app.get('/api/render-card', (req, res) => {
  const title = req.query.title || 'Server-rendered card';
  const body = req.query.body || 'Rendered at ' + new Date().toLocaleTimeString();

  const fullHtml = render(protocol, {
    textdirection: 'ltr',
    language: 'en',
    title: title,
    body: body,
    items: [],
    remainingCount: 0,
  }, { plugin: 'webui' });

  // Extract the info-card's DSD inner content — strip the shadow DOM wrapper
  const match = fullHtml.match(
    /<info-card[^>]*><template shadowrootmode="open">([\s\S]*?)<\/template><\/info-card>/
  );

  if (match) {
    res.type('html').send(match[1]);
  } else {
    res.status(500).send('Could not extract info-card from render output');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
