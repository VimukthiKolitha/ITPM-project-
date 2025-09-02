// routes/aiRoutes.js
import express from "express";
import {getAiHelperResponse} from '../controllers/AiController.js'

const router = express.Router();

router.post("/ai-helper-response", getAiHelperResponse);

export default router;
