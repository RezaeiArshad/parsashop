import 'dotenv/config';
import Typesense from 'typesense';

// 🔧 Configuration
const config = {
  apiKey: process.env.TYPESENSE_API_KEY,
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.TYPESENSE_PORT, 10) || 8108,
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  connectionTimeoutSeconds: 20,
  retryIntervalSeconds: 1,
  numRetries: 3,
  logLevel: 'warn', // reduce noise in prod; use 'info' or 'debug' in dev
};

// 🚀 Initialize client
let typesenseClient;

try {
  typesenseClient = new Typesense.Client(config);
} catch (error) {
  console.error('❌ Failed to initialize Typesense client:', error.message);
  throw new Error(
    'Typesense client initialization failed. Check .env and network.'
  );
}

// ✅ Health check helper
export async function checkHealth() {
  try {
    const { ok } = await typesenseClient.health.retrieve();
    return ok === true;
  } catch (err) {
    console.error('🔴 Typesense health check failed:', err.message);
    return false;
  }
}

// 📦 Re-export client for direct use (e.g., in services)
export default typesenseClient;
