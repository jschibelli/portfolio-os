// Polyfills for Jest environment
const { fetch, Request, Response, Headers } = require('whatwg-fetch')

// Set up global fetch polyfill
global.fetch = fetch
global.Request = Request
global.Response = Response
global.Headers = Headers
