const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = path.join(__dirname);
const port = 5173;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '/');
  let pathname = parsed.pathname || '/';
  if (pathname === '/') pathname = '/index.html';

  const filePath = path.join(root, pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Frontend running at http://localhost:${port}`);
});
