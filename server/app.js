import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import transcriptionRouter from './routes/transcription.route.js';

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors({ origin: true }))

app.use("/audios", express.static("public/audios"));  // Serve audio files from /public/audios

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the girlfriend server!' })
})

app.use('/transcript', transcriptionRouter)

app.listen(PORT, () => console.log(`Server is up and running 🏃 on port ${PORT}`))