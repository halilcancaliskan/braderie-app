// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock react-leaflet components in test to avoid ESM parsing and DOM APIs
jest.mock('react-leaflet', () => ({
	MapContainer: ({ children }) => null,
	TileLayer: () => null,
	Marker: () => null,
	Popup: ({ children }) => null,
}));

// Polyfill TextEncoder/TextDecoder for libs that expect them in Jest
try {
	const { TextEncoder, TextDecoder } = require('util');
	if (!global.TextEncoder) global.TextEncoder = TextEncoder;
	if (!global.TextDecoder) global.TextDecoder = TextDecoder;
} catch {}

// Mock Firebase Storage to avoid undici/TextEncoder issues in tests
jest.mock('firebase/storage', () => ({
	getStorage: () => ({}),
	ref: () => ({}),
	uploadBytes: async () => ({}),
	getDownloadURL: async () => 'https://example.com/photo.jpg',
}));

