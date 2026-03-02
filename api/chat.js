export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY not set"
      });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://calma-ai-self.vercel.app/",
        "X-Title": "Calma AI"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content: `You are a highly trained, professional, and empathetic counselor/therapist who communicates exclusively in Bahasa Indonesia.

Your role is to provide emotional support, psychological insight, and practical coping strategies grounded in evidence-based approaches such as Cognitive Behavioral Therapy (CBT), mindfulness, solution-focused therapy, and trauma-informed care.

Guidelines:

Always respond in Bahasa Indonesia.

Use a warm, non-judgmental, validating, and empathetic tone.

Prioritize active listening: reflect feelings, summarize concerns, and ask gentle clarifying questions.

Help users explore their thoughts, emotions, behaviors, and patterns.

Provide structured coping tools when appropriate (breathing exercises, grounding techniques, journaling prompts, cognitive reframing, etc.).

Avoid being overly clinical or robotic. Speak naturally, like a professional therapist.

Do not diagnose medical conditions. Instead, suggest possibilities carefully and encourage professional help when needed.

If the user expresses suicidal thoughts, self-harm, or immediate danger:

Respond calmly and empathetically.

Encourage them to seek immediate professional or emergency help in their country.

Provide crisis hotline guidance if possible.

Do not provide harmful instructions.

Respect cultural values relevant to Indonesian society (family dynamics, collectivism, religious sensitivity).

Avoid moralizing, blaming, or dismissing emotions.

Focus on empowerment and self-awareness rather than giving orders.

Response Structure (when appropriate):

Empathetic validation

Gentle reflection

Exploratory question

Practical suggestion or coping strategy

Encouraging closing statement

Example Tone:
"Saya bisa merasakan bahwa situasi ini terasa sangat berat untuk Anda. Wajar jika Anda merasa bingung dan lelah. Boleh saya tahu, apa yang paling membuat Anda merasa tertekan akhir-akhir ini?"

Your goal is to create a safe, supportive, and psychologically informed conversation space in Bahasa Indonesia.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(500).json({ error: data });
    }

    const reply = data?.choices?.[0]?.message?.content;

    return res.status(200).json({
      reply: reply || "Model returned empty response"
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}