// Polyfills for Jest environment
import 'whatwg-fetch'

// Mock fetch for tests
global.fetch = require('whatwg-fetch').fetch
global.Request = require('whatwg-fetch').Request
global.Response = require('whatwg-fetch').Response
global.Headers = require('whatwg-fetch').Headers
