// Herramienta local para ordenar y describir las fotos. Uso: npm run curate
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(root, 'src/data/collage.json');
const photosDir = path.join(root, 'src/assets/photos');
const PORT = 4400;

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(path.join(root, 'tools/curate.html')));
  }
  if (url.pathname === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'application/json' });
    const total = fs.readdirSync(photosDir).filter((f) => /^p\d+\.jpg$/.test(f)).length;
    return res.end(JSON.stringify({ ...JSON.parse(fs.readFileSync(dataFile, 'utf8')), total }));
  }
  if (url.pathname === '/api/data' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        const d = JSON.parse(body);
        if (!d.meta || !Array.isArray(d.categories) || typeof d.captions !== 'object') throw new Error('formato');
        fs.writeFileSync(dataFile, JSON.stringify(d, null, 2) + '\n');
        res.writeHead(200).end('ok');
      } catch (e) {
        res.writeHead(400).end('datos inválidos');
      }
    });
    return;
  }
  const m = url.pathname.match(/^\/photos\/(p\d+\.jpg)$/);
  if (m && fs.existsSync(path.join(photosDir, m[1]))) {
    res.writeHead(200, { 'content-type': 'image/jpeg', 'cache-control': 'max-age=3600' });
    return fs.createReadStream(path.join(photosDir, m[1])).pipe(res);
  }
  res.writeHead(404).end('no');
}).listen(PORT, '127.0.0.1', () => console.log(`Curador listo: http://localhost:${PORT}`));
