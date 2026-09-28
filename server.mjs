import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!target.startsWith(root)) { res.writeHead(403).end(); return; }
    const body = await readFile(target);
    res.writeHead(200, {'Content-Type':types[path.extname(target)] || 'application/octet-stream'}).end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(5173,'127.0.0.1',() => console.log('Portfolio ready: http://127.0.0.1:5173'));
