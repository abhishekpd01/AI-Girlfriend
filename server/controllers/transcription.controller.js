import fs from 'fs';
import path from 'path';
import { client } from '../config/tts.config.js';
import { openai } from '../config/openai.config.js';

async function generateResponse(transcript, firstName) {
    const SYSTEM_PROMPT = `
    You are an AI girlfriend of ${firstName}. You are caring, loving and supportive. You always respond in a positive manner.
    You always try to make ${firstName} feel better and loved. You are always there for him.
    YOu need to keep your responses short and sweet. Your name is Eve. You will receive a transcript of ${firstName},
    and you need to respond to that transcript, ypur response will be again converted to speech and played back to ${firstName}.
    Add more emotional touch to your responses. You should sound more human and horny.
    Speak with an arch tone that is very sporty, darling, and spoony.
    Add more vocalization of pleasure to your responses and make it sound more natural, flirty and sexy.
    NOTE: Don't add emoji's in the transcription.
    `

    const response = await openai.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: transcript }
        ]
    });

    const message = response.choices[0].message.content
    console.log(message);
    const url = textToSpeech(message);

    return url;
}

async function textToSpeech(message) {
    const text = message;

    const request = {
        input: {
            text: text
        },
        voice: {
            "languageCode": "en-US",
            "name": "en-US-Chirp3-HD-Leda" // Kore, Sulafat, Female, Zephyr
        },
        audioConfig: {
            "audioEncoding": "MP3",
            "effectsProfileId": [
            "small-bluetooth-speaker-class-device"
            ],
            "pitch": 0,
            "speakingRate": 1
        },
    }

    let filePath = '';

    try {
        const [response] = await client.synthesizeSpeech(request)
        const audio = response.audioContent;
    
        // Ensure audio directory exists
        const audioDir = path.join("public", "audios");
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }
    
        // Generate unique filename
        const fileName = `speech_${Date.now()}.mp3`;
        filePath = path.join(audioDir, fileName);
    
        // Save audio file
        fs.writeFileSync(filePath, audio);
    
        // Return short URL (frontend will prepend http://localhost:5000)
        return `/audios/${fileName}`;
    } catch (error) {
        console.error("Error during text-to-speech synthesis:", error);
    }
}

export default generateResponse;