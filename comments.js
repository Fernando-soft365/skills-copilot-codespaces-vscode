// Create web server
const http = require('http');
const url = require('url');

// Store comments in memory
let comments = [];
let nextId = 1;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET /comments - Get all comments
  if (pathname === '/comments' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comments));
  }
  // POST /comments - Create a new comment
  else if (pathname === '/comments' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const comment = JSON.parse(body);
        const newComment = {
          id: nextId++,
          text: comment.text,
          author: comment.author || 'Anonymous',
          timestamp: new Date().toISOString()
        };
        comments.push(newComment);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newComment));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }
  // DELETE /comments/:id - Delete a comment
  else if (pathname.startsWith('/comments/') && method === 'DELETE') {
    const id = parseInt(pathname.split('/')[2]);
    const index = comments.findIndex(c => c.id === id);
    if (index !== -1) {
      comments.splice(index, 1);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Comment deleted' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Comment not found' }));
    }
  }
  // Default response
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
  console.log('Available endpoints:');
  console.log('  GET    /comments - Get all comments');
  console.log('  POST   /comments - Create a new comment');
  console.log('  DELETE /comments/:id - Delete a comment');
});



