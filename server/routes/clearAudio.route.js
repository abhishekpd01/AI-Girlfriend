import { Router } from "express";
import clearAudio from "../controllers/clearAudio.controller.js";

const clearAudioRouter = Router();

clearAudioRouter.delete('/', clearAudio)

export default clearAudioRouter;