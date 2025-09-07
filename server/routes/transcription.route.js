import { Router } from "express";
import generateResponse from "../controllers/transcription.controller.js";

const transcriptionRouter = Router();

transcriptionRouter.post('/', async (req, res) => {
    try {
        const { transcript } = req.body;
        console.log('Received transcript: ', transcript);

        const audioUrl = await generateResponse(transcript);
        console.log('Generated audio URL:', audioUrl);

        return res.status(200).json({ 
            audioUrl,
            success: true,
            message: 'Audio generated successfully'
        });
    } catch (error) {
        console.error("Error in transcription route:", error);
        return res.status(500).json({ 
            success: false,
            message: "Failed to generate audio"
        });
    }
});

export default transcriptionRouter;
