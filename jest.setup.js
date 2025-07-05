import '@testing-library/jest-dom'

// Polyfill for Next.js API routes testing
global.Request = global.Request || require('node-fetch').Request;
global.Response = global.Response || require('node-fetch').Response;
global.Headers = global.Headers || require('node-fetch').Headers;