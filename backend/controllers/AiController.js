import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

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

  const prompt = `
Primary Symptom: ${primarySymptom}
Duration of Symptoms: ${duration}
Pain Level: ${painLevel}
Type of Pain: ${painType}
Description: ${description}
Medical History: ${history}
Current Medications: ${medications}
  `;

  const candidateModels = ["gemini-3.8-flash", "gemini-3.8-pro"];

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: `You are a medical symptom helper. When given patient symptom information, generate a JSON object matching this exact structure:
{
   "Summery": "Brief summary about possible disease or condition",
   "Doctor suggesion": "What specialized doctor type they should book (e.g. Cardiologist, Dermatologist, Neurologist)",
   "Tipes": "Good health habits and general advice to overcome or manage the situation"
}`,
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          responseMimeType: "application/json",
        },
      });

      const responseText = result.response.text();
      return res.status(200).json({ result: responseText });

    } catch (err) {
      console.warn(`Model ${modelName} failed, attempting next model... Error: ${err.message}`);
      lastError = err;
    }
  }

  console.error("All AI models failed:", lastError);
  return res.status(500).json({ error: "Failed to generate AI response: " + lastError?.message });
};