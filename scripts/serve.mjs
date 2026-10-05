import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
createServer(async (request, response) => { try { const path = normalize(decodeURIComponent(new URL(request.url, 'http://localhost').pathname)).replace(/^\.\.(\/|\\)/, ''); const file = join('site', path === '/' ? 'index.html' : path); response.setHeader('content-type', types[extname(file)] || 'application/octet-stream'); response.end(await readFile(file)); } catch { response.statusCode = 404; response.end('Not found'); } }).listen(4173, '127.0.0.1', () => console.log('Houseki demo: http://127.0.0.1:4173'));
