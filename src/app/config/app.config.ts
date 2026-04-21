export const APP_CONFIG = {
  apiUrl: (globalThis as any)?.process?.env?.['API_URL'] || 'http://localhost:8080',
  mpUrl: (globalThis as any)?.process?.env?.['MP_URL'] || 'http://localhost:8080/api/v1/mp'
};