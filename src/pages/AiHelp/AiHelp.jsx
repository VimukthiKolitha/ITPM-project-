import React, { useState } from 'react';
import axios from 'axios';

function AiHelp() {
  const [formData, setFormData] = useState({
    primarySymptom: '',
    duration: '',
    painLevel: '',
    painType: '',
    description: '',
    history: '',
    medications: '',
  });

  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);

    try {
      const response = await axios.post('http://localhost:4000/api/AI/ai-helper-response', formData);
      const resultText = response.data.result;

      // Attempt to parse if it's JSON format
      try {
        const parsed = JSON.parse(resultText);
        setAiResult(parsed);
      } catch (err) {
        setAiResult({ raw: resultText });
      }

    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAiResult({ error: 'Failed to get AI help. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-center">Welcome to Ai Helper</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Primary Symptom */}
          <InputField label="Primary Symptom / Affected Body Part" name="primarySymptom" placeholder="e.g., Headache, Stomach, etc." value={formData.primarySymptom} onChange={handleChange} />

          {/* Duration */}
          <InputField label="Duration of Symptoms" name="duration" placeholder='e.g., "2 days", "1 week"' value={formData.duration} onChange={handleChange} />

          {/* Pain Level */}
          <InputField label="Pain Level" name="painLevel" type="number" min="1" max="10" placeholder="Scale from 1 to 10" value={formData.painLevel} onChange={handleChange} />

          {/* Type of Pain */}
          <InputField label="Type of Pain" name="painType" placeholder="e.g., sharp, dull, throbbing" value={formData.painType} onChange={handleChange} />

          {/* Disease Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Describe your Disease</label>
            <textarea
              name="description"
              className="w-full border border-gray-300 rounded-md p-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide a brief description..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Medical History */}
          <InputField label="Medical History (Optional)" name="history" placeholder="e.g., diabetes, hypertension" value={formData.history} onChange={handleChange} />

          {/* Medications */}
          <InputField label="Current Medications" name="medications" placeholder="e.g., aspirin, insulin" value={formData.medications} onChange={handleChange} />

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            {loading ? 'Analyzing...' : 'Help me'}
          </button>
        </form>

        {/* Output Section */}
        {aiResult && (
          <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">AI Suggestion:</h3>
            {aiResult.error && <p className="text-red-500">{aiResult.error}</p>}
            {aiResult.raw && <pre>{aiResult.raw}</pre>}
            {!aiResult.raw && !aiResult.error && (
              <div className="space-y-2">
                <p><strong>Summary:</strong> {aiResult.Summery}</p>
                <p><strong>Doctor Suggestion:</strong> {aiResult["Doctor suggesion"]}</p>
                <div>
                  <strong>Tips:</strong>
                  {Array.isArray(aiResult.Tipes) ? (
                    <ul className="list-disc list-inside mt-1">
                      {aiResult.Tipes.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{aiResult.Tipes}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable input field component
const InputField = ({ label, name, placeholder, value, onChange, type = "text", ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  </div>
);

export default AiHelp;
