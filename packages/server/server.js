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

// API endpoint — render a component directly and return downleveled HTML
app.get('/api/render-card', (req, res) => {
  const title = req.query.title || 'Server-rendered card';
  const body = req.query.body || 'Rendered at ' + new Date().toLocaleTimeString();

  // Render just the info-card component — no full page render
  const dsd = render(protocol, { title, body }, { entry: 'info-card', plugin: 'webui' });

  // Strip the DSD wrapper — return the inner content as flat HTML
  const inner = dsd
    .replace(/^<template shadowrootmode="open">/, '')
    .replace(/<\/template>$/, '');

  res.type('html').send(inner);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
