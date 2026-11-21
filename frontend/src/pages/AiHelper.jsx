import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AiHelperModal = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    primarySymptom: '',
    duration: '',
    painLevel: 5,
    painType: '',
    description: '',
    history: '',
    medications: ''
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);

    try {

      const { data } = await axios.post(`${backendUrl}/api/AI/ai-helper-response`, formData);

      if (data.result) {
        // Strip out code block ticks (```json ... ```) if Gemini returns raw markdown
        let cleanText = data.result.trim();
        if (cleanText.startsWith("```json")) {
          cleanText = cleanText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        const parsed = JSON.parse(cleanText);
        setAiResult(parsed);
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);
      toast.error(error.response?.data?.error || "Failed to get AI recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all z-50 flex items-center justify-center gap-2"
        title="AI Medical Helper"
      >
        <span className="text-xl">✨</span>
        <span className="hidden sm:inline font-medium">AI Health Assistant</span>
      </button>

      {/* 2. Modal Overlay & Popup Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-gray-700">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              ✨ AI Specialist Suggester
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Describe your symptoms to find the right medical specialist.
            </p>

            {/* Results Display */}
            {aiResult ? (
              <div className="space-y-4 text-sm bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div>
                  <h4 className="font-semibold text-blue-900">Summary:</h4>
                  <p className="text-gray-700">{aiResult.Summery || aiResult.Summary}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Suggested Doctor:</h4>
                  <p className="text-primary font-bold">{aiResult["Doctor suggesion"] || aiResult["Doctor suggestion"]}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Health Tips:</h4>
                  <p className="text-gray-700">{aiResult.Tipes || aiResult.Tips}</p>
                </div>
                <button
                  onClick={() => setAiResult(null)}
                  className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-semibold hover:bg-gray-300"
                >
                  Analyze New Symptoms
                </button>
              </div>
            ) : (
              /* Symptom Form */
              <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Primary Symptom / Affected Body Part *</label>
                  <input
                    type="text"
                    name="primarySymptom"
                    required
                    value={formData.primarySymptom}
                    onChange={handleChange}
                    placeholder="e.g., Lower Back, Chest, Knee"
                    className="w-full border p-2 rounded-lg mt-1 outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Duration *</label>
                    <input
                      type="text"
                      name="duration"
                      required
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g., 3 days, 2 weeks"
                      className="w-full border p-2 rounded-lg mt-1 outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600">Pain Level (1-10): {formData.painLevel}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      name="painLevel"
                      value={formData.painLevel}
                      onChange={handleChange}
                      className="w-full mt-2 accent-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Type of Pain</label>
                  <input
                    type="text"
                    name="painType"
                    value={formData.painType}
                    onChange={handleChange}
                    placeholder="e.g., Sharp, Dull ache, Burning, Throbbing"
                    className="w-full border p-2 rounded-lg mt-1 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Detailed Description</label>
                  <textarea
                    name="description"
                    rows="2"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe how it feels or when it happens..."
                    className="w-full border p-2 rounded-lg mt-1 outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Medical History</label>
                    <input
                      type="text"
                      name="history"
                      value={formData.history}
                      onChange={handleChange}
                      placeholder="e.g., Diabetes, Asthma"
                      className="w-full border p-2 rounded-lg mt-1 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Current Medications</label>
                    <input
                      type="text"
                      name="medications"
                      value={formData.medications}
                      onChange={handleChange}
                      placeholder="e.g., Aspirin, Metformin"
                      className="w-full border p-2 rounded-lg mt-1 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all mt-3 disabled:opacity-50"
                >
                  {loading ? "Analyzing Symptoms..." : "Get AI Recommendation"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AiHelperModal;