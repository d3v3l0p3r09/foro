const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || 'https://TU-API.onrender.com/api';
const frontendUrl =
  process.env.FRONTEND_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:4200');

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl.replace(/'/g, "\\'")}',
  frontendUrl: '${frontendUrl.replace(/'/g, "\\'")}',
};
`;

fs.writeFileSync(path.join(__dirname, '../src/environments/environment.prod.ts'), content);
console.log('Generated environment.prod.ts');
console.log('  apiUrl:', apiUrl);
console.log('  frontendUrl:', frontendUrl);
