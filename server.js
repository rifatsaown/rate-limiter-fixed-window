const http = require('http');
const rateLimitWindowMs = 60 * 1000; // Fixed window size (1 minute)
const maxRequestsPerWindow = 5;
// Track per-IP request counts within the current window.
const ipRequests = {}; // { 'ip': { count: Number, startTime: Timestamp } }

const rateLimitMiddleware = (req, res) => {
  // Note: remoteAddress may be IPv6 format (e.g., ::1 on localhost).
  const ip = req.socket.remoteAddress;
  const currentTime = Date.now();
  if (!ipRequests[ip]) {
    ipRequests[ip] = { count: 1, startTime: currentTime };
  } else {
    // Compare against the start of the current fixed window.
    const timePassed = currentTime - ipRequests[ip].startTime;
    if (timePassed < rateLimitWindowMs) {
      ipRequests[ip].count++;
    } else {
      // Reset the fixed window when it expires.
      ipRequests[ip].count = 1;
      ipRequests[ip].startTime = currentTime;
    }
  } // Reject when the limit is exceeded for this window.
  if (ipRequests[ip].count > maxRequestsPerWindow) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Too many requests. Try again later.');
    return false; // Stop the request pipeline when rate-limited.
  }
  return true; // Allow request through.
};

const server = http.createServer((req, res) => {
  // Short-circuit if the request was rate-limited.
  if (!rateLimitMiddleware(req, res)) return;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, world!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
