export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HF_API_KEY}`
        },
        body: JSON.stringify({
          inputs: `
<|begin_of_text|>
<|start_header_id|>system<|end_header_id|>
You are a helpful Indonesian-speaking assistant.
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
${message}
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
`
        })
      }
    );

    const data = await response.json();
    const reply = data[0]?.generated_text || "No response";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ error: "Error generating response" });
  }
}