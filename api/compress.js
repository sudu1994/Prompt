export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

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
          inputs: `[INST] Optimize and shorten this prompt for an AI, removing filler words but keeping core intent: ${prompt} [/INST]` 
        }),
      }
    );

    const data = await response.json();
    // Mistral usually returns an array with generated_text
    const result = data[0]?.generated_text?.split('[/INST]')[1]?.trim() || "Compression failed.";
    
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "AI Connection Error" });
  }
}
