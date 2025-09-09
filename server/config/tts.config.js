import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load credentials from environment variable
try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      // Write the JSON content to a temporary file
      const credentialsPath = path.resolve(__dirname, 'temp-credentials.json');
      writeFileSync(credentialsPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    } else {
      // For local development, keep the file path
      process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, 'gen-lang-client-0857479096-64e1c1d24cb6.json');
    }
    console.log('Google Cloud credentials set successfully.')
} catch (error) {
    console.error('Error setting up Google Cloud credentials:', error)
}

import { TextToSpeechClient } from '@google-cloud/text-to-speech';

export const client = new TextToSpeechClient();