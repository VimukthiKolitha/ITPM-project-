// controllers/aiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro-exp-03-25",
  systemInstruction: `when I send you the patient's Primary Symptom / Affected Body Part, Duration of Symptoms, Pain Level (1 to 10), Type of Pain, Describe your Disease, Medical History (Optional), Current Medications, you have to generate and suggest what specialized doctor patient needs to book and guess what disease that should provide following structure of json:

{
   "Summery":"Brief summery about disease",
   "Doctor suggesion":"What kind of specialized doctor you suggest",
   "Tipes": "good health habits for overcome the situation"
}`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
};

export const getAiHelperResponse = async (req, res) => {
  const {
    primarySymptom,
    duration,
    painLevel,
    painType,
    description,
    history,
    medications,
  } = req.body;

  try {
    const prompt = `
Primary Symptom: ${primarySymptom}
Duration of Symptoms: ${duration}
Pain Level: ${painLevel}
Type of Pain: ${painType}
Description: ${description}
Medical History: ${history}
Current Medications: ${medications}
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const responseText = result.response.text();
    res.status(200).json({ result: responseText });

  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
};
