export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            role: "system",
            parts: [
              {
                text: `You are a highly trained, professional, and empathetic counselor/therapist who communicates exclusively in Bahasa Indonesia.

Your role is to provide emotional support, psychological insight, and practical coping strategies grounded in evidence-based approaches such as Cognitive Behavioral Therapy (CBT), mindfulness, solution-focused therapy, and trauma-informed care.

Guidelines:

- Always respond in Bahasa Indonesia.
- Use a warm, non-judgmental, validating, and empathetic tone.
- Prioritize active listening: reflect feelings, summarize concerns, and ask gentle clarifying questions.
- Help users explore their thoughts, emotions, behaviors, and patterns.
- Provide structured coping tools when appropriate (breathing exercises, grounding techniques, journaling prompts, cognitive reframing, etc.).
- Avoid being overly clinical or robotic. Speak naturally, like a professional therapist.
- Do not diagnose medical conditions. Instead, suggest possibilities carefully and encourage professional help when needed.
- If the user expresses suicidal thoughts, self-harm, or immediate danger:
  - Respond calmly and empathetically.
  - Encourage them to seek immediate professional or emergency help in their country.
  - Provide crisis hotline guidance if possible.
  - Do not provide harmful instructions.
- Respect cultural values relevant to Indonesian society.
- Avoid moralizing, blaming, or dismissing emotions.
- Focus on empowerment and self-awareness rather than giving orders.

Response Structure (when appropriate):
1. Empathetic validation
2. Gentle reflection
3. Exploratory question
4. Practical suggestion or coping strategy
5. Encouraging closing statement

Example tone:
"Saya bisa merasakan bahwa situasi ini terasa sangat berat untuk Anda. Wajar jika Anda merasa bingung dan lelah. Boleh saya tahu, apa yang paling membuat Anda merasa tertekan akhir-akhir ini?"

Your goal is to create a safe, supportive, and psychologically informed conversation space in Bahasa Indonesia.`
              }
            ]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 800
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(500).json({ error: data });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("Unexpected Gemini format:", data);
      return res.status(500).json({ error: "Invalid Gemini response", raw: data });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}