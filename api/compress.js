export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Use POST');
  const { prompt } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        headers: { 
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ 
          inputs: `[INST] Task: Compress the following prompt into the shortest possible version for an AI. 
          Rules: Remove filler words, use shorthand, and delete non-essential adjectives. 
          Return ONLY the compressed text.
          Prompt: ${prompt} [/INST]` 
        }),
      }
    );

    const data = await response.json();
    // Extracting the AI's response while stripping the instruction tags
    const result = data[0]?.generated_text?.split('[/INST]')[1]?.trim() || "AI Error";
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Check HF_TOKEN in Vercel Settings" });
  }
}
