const http = require('http');

// Perform a single HTTP request and return status/body.
function makeRequest() {
  return new Promise((resolve) => {
    // Fire a GET request to the server.
    const req = http.get('http://localhost:3000/', (res) => {
      let data = '';
      // Aggregate the response body for logging.
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    // Surface network errors as a resolved value so the test loop continues.
    req.on('error', (err) => resolve({ error: err.message }));
  });
}

// Send a burst of requests to observe the fixed window limit.
async function test() {
  console.log('Testing rate limiter...\n');

  // 7 requests will exceed the 5-per-minute limit.
  for (let i = 1; i <= 7; i++) {
    const result = await makeRequest();
    console.log(`Request ${i}: Status ${result.status} - ${result.body}`);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
  }
}
test();
