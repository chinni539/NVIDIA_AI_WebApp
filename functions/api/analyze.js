/**
 * Analyze text using NVIDIA API
 * Endpoint: POST /api/analyze
 */

async function analyzeWithNvidia(prompt, env) {
  const NVIDIA_API_URL = env.NVIDIA_API_URL || "https://integrate.api.nvidia.com/v1/chat/completions";
  const NVIDIA_MODEL = env.NVIDIA_MODEL || "nvidia/ising-calibration-1-35b-a3b";
  const NVIDIA_API_KEY = env.NVIDIA_API_KEY;

  if (!NVIDIA_API_KEY) {
    return { error: "NVIDIA API Key is missing." };
  }

  const headers = {
    "Authorization": `Bearer ${NVIDIA_API_KEY}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  const payload = {
    model: NVIDIA_MODEL,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 2048,
    temperature: 0.2,
    top_p: 0.7,
    stream: false,
  };

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { error: `NVIDIA API error: ${response.status}` };
    }

    const data = await response.json();
    const choices = data.choices || [];

    if (!choices.length) {
      return { error: "No response returned from NVIDIA." };
    }

    const message = choices[0].message || {};
    return {
      success: true,
      content: message.content || "No content generated."
    };

  } catch (e) {
    return { error: `Error: ${e.message}` };
  }
}

export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const prompt = body.prompt;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await analyzeWithNvidia(prompt, env);

    return new Response(
      JSON.stringify(result),
      {
        status: result.error ? 400 : 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
