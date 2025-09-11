import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import transcriptionRouter from './routes/transcription.route.js';
import clearAudioRouter from './routes/clearAudio.route.js';

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:3000',           // for local development
    'https://ai-girlfriend-theta.vercel.app/',  // replace with your actual Vercel URL
    'http://localhost:5173/'   // if you have a custom domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/audios", express.static("public/audios"));  // Serve audio files from /public/audios

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the girlfriend server!' })
})

app.use('/transcript', transcriptionRouter)
app.use('/clear-audio', clearAudioRouter)

app.listen(PORT, () => console.log(`Server is up and running 🏃 on port ${PORT}`))