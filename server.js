import express from 'express';
import fs from 'node:fs';
import { render } from '@microsoft/webui';

const app = express();
const PORT = 3000;

// Load the pre-built protocol from disk (run `npm run build:templates` first)
const protocol = fs.readFileSync('./dist/protocol.bin');

// Serve a simple page with a button
app.get('/', (req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Downlevel Demo</title>
</head>
<body>
  <h1>Downlevel Rendering Demo</h1>
  <p>Click the button to fetch a server-rendered component as plain HTML (no shadow DOM):</p>
  <button id="fetch-card">Fetch Card from Server</button>
  <div id="card-container"></div>
  <script>
    document.getElementById('fetch-card').addEventListener('click', async () => {
      const res = await fetch('/api/render-card?title=Hello+from+server&body=This+was+rendered+at+' + encodeURIComponent(new Date().toLocaleTimeString()));
      const html = await res.text();
      document.getElementById('card-container').insertAdjacentHTML('beforeend', html);
    });
  </script>
</body>
</html>`);
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
