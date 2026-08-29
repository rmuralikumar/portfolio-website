import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from './api/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Load .env or .env.local
const envFiles = ['.env.local', '.env'];
for (const file of envFiles) {
  const envPath = path.join(__dirname, file);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...values] = trimmed.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
    break;
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Route: /api/contact -> api/contact.js
  if (pathname === '/api/contact' || pathname === '/api/contact/') {
    // Collect request body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      // Create Express/Vercel compatible response helper
      const vercelRes = {
        setHeader(name, value) {
          res.setHeader(name, value);
          return this;
        },
        status(code) {
          res.statusCode = code;
          return this;
        },
        json(data) {
          res.setHeader('Content-Type', 'application/json; charset=UTF-8');
          res.end(JSON.stringify(data));
          return this;
        }
      };

      // Create Express/Vercel compatible request helper
      req.body = body;
      try {
        await handler(req, vercelRes);
      } catch (err) {
        console.error('Server Handler Error:', err);
        if (!res.writableEnded) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
        }
      }
    });
    return;
  }

  // Serve static files
  let reqPath = (pathname === '/' || pathname === '') ? 'index.html' : pathname.replace(/^\/+/, '');
  reqPath = decodeURIComponent(reqPath.split('?')[0]);
  let filePath = path.join(__dirname, reqPath);

  // If directory, check for index.html inside it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // If file doesn't exist, try with .html extension
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  // Check if file exists and is readable
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.end('<h1>404 Not Found</h1>');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);
  fs.createReadStream(filePath).pipe(res);
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Portfolio Local Server Running:`);
    console.log(`👉 http://localhost:${port}`);
    console.log(`✉️  API Route Active: POST /api/contact`);
    console.log(`==================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);

