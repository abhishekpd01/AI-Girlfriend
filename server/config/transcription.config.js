import OpenAI from 'openai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';


export const openai = new OpenAI({
    apiKey: 'AIzaSyBvYi8ZLCMRqlbnAKkgWxJyBZhkd3NvRv4',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

export const client = new TextToSpeechClient();