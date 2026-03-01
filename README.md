# Fixed Window Rate Limiter (Node.js)
The **Fixed Window** algorithm is one of the simplest to implement. It works by tracking requests for each user within a specific, fixed time frame (e.g., one minute).

  * When a request comes in, the algorithm checks how many requests the user has made in the current window.
  * If the count is below the limit, the request is allowed, and the counter is incremented.
  * If the count is at or above the limit, the request is blocked.
  * Once the time window ends, the counter is reset for the next window.


## Overview
It is a simple Node.js application that uses the Fixed Window algorithm to rate limit requests.

![alt text](./infra-2.svg)

The logic is straightforward, for each user (identified by their IP address), the app maintains a simple counter and a start time. When a request arrives, the app checks if the user's 1-minute time window has expired.
- If the window is still active, it increments the counter.
- If the window has expired, it resets the counter and the timer.
- If the counter exceeds the limit at any point, the request is rejected.

-------------


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
