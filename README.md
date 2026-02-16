# Fixed Window Rate Limiter (Node.js)

A minimal Node.js HTTP server that demonstrates fixed window rate limiting by IP address. The server allows a set number of requests within a fixed time window and returns HTTP 429 when the limit is exceeded.

## How it works (fixed window)

- Time is divided into fixed-size windows (here: 60 seconds).
- Each client (by IP) has a counter for the current window.
- Requests within the window increment the counter.
- When the window expires, the counter resets to 1 on the next request.
- If the counter exceeds the limit, the server responds with 429.

This is simple and fast, but can allow bursts at window boundaries (for example, a client can send requests at the end of one window and the start of the next).

## Project files

- server.js: HTTP server with fixed window rate limiting logic.
- test.js: Simple client script to send multiple requests.

## Run the server

```bash
node server.js
```

Server starts on http://localhost:3000.

## Test the limiter

In another terminal:

```bash
node test.js
```

You should see successful responses for the first few requests, then 429 responses once the limit is exceeded.

## Configuration

Adjust these constants in server.js:

- rateLimitWindowMs: Window size in milliseconds.
- maxRequestsPerWindow: Max requests allowed per window.
