import OpenAI from 'openai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';


export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.BASE_URL,
});

export const client = new TextToSpeechClient();