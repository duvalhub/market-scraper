
// TODO: Use normalization to compare strings https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/#normalization
// Check https://github.com/mathiasbynens/punycode.js for better handling unicode strings
// or https://github.com/mathiasbynens/regenerate for specialized regex
export const removeSpecialCharacters = (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')