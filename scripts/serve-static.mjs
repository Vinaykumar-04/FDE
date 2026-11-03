import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
const portIndex = process.argv.indexOf('--port');
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 3000);
const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2',
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
    const safePath = path.resolve(root, `.${pathname}`);
    if (safePath !== root && !safePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const candidates = [safePath, path.join(safePath, 'index.html'), `${safePath}.html`];
    let file;
    for (const candidate of candidates) {
      try { if ((await stat(candidate)).isFile()) { file = candidate; break; } } catch { /* try the next static export path */ }
    }
    if (!file) { response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found'); return; }
    response.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end('Bad request');
  }
}).listen(port, '0.0.0.0', () => console.log(`FDE Hero Academy static export: http://localhost:${port}`));
