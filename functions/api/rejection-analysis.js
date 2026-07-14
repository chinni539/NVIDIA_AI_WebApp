/**
 * Analyze rejection data using NVIDIA AI
 * Endpoint: POST /api/rejection-analysis
 * 
 * Expected body:
 * {
 *   "excelData": [
 *     { "STATE": "CA", "County": "Los Angeles", "Event Description for EOF": "reason" },
 *     ...
 *   ]
 * }
 */

async function analyzeWithNvidia(prompt, env) {
  const NVIDIA_API_URL = env.NVIDIA_API_URL || "https://integrate.api.nvidia.com/v1/chat/completions";
  const NVIDIA_MODEL = env.NVIDIA_MODEL || "nvidia/ising-calibration-1-35b-a3b";
  const NVIDIA_API_KEY = env.NVIDIA_API_KEY;

  if (!NVIDIA_API_KEY) {
    throw new Error("NVIDIA API Key is missing.");
  }

  const headers = {
    "Authorization": `Bearer ${NVIDIA_API_KEY}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  const payload = {
    model: NVIDIA_MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4096,
    temperature: 0.2,
    top_p: 0.7,
    stream: false,
  };

  const response = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA API error: ${response.status}`);
  }

  const data = await response.json();
  const choices = data.choices || [];

  if (!choices.length) {
    throw new Error("No response returned from NVIDIA.");
  }

  return choices[0].message.content;
}

function analyzeRejectionData(excelData) {
  const stateCol = "STATE";
  const countyCol = "County";
  const reasonCol = "Event Description for EOF";

  // Count top states
  const stateCounts = {};
  excelData.forEach(row => {
    const state = row[stateCol];
    if (state) {
      stateCounts[state] = (stateCounts[state] || 0) + 1;
    }
  });

  const topStates = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Count top counties
  const countyCounts = {};
  excelData.forEach(row => {
    const county = row[countyCol];
    if (county) {
      countyCounts[county] = (countyCounts[county] || 0) + 1;
    }
  });

  const topCounties = Object.entries(countyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Extract top rejection reasons
  const reasonCounts = {};
  excelData.forEach(row => {
    let reason = row[reasonCol];
    if (reason) {
      reason = String(reason).replace(
        "Package created. EFiling order failed due: vendor.",
        ""
      );

      const parts = reason.split(";");
      parts.forEach(p => {
        p = p.trim();
        if (p) {
          reasonCounts[p] = (reasonCounts[p] || 0) + 1;
        }
      });
    }
  });

  const topReasons = Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return { topStates, topCounties, topReasons };
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { excelData } = body;

    if (!excelData || !Array.isArray(excelData)) {
      return new Response(
        JSON.stringify({ error: "excelData array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { topStates, topCounties, topReasons } = analyzeRejectionData(excelData);

    const prompt = `
You are a Senior Business Analyst working in Mortgage and eRecording domain.

Analyze the rejection data and provide:

1. Executive Summary.
2. Top observations.
3. Root causes.
4. Why these states/counties have higher rejections.
5. Recommendations to reduce rejections.
6. Preventive actions.
7. State specific recommendations.

Top Rejected States:
${JSON.stringify(topStates)}

Top Rejected Counties:
${JSON.stringify(topCounties)}

Top Rejection Reasons:
${JSON.stringify(topReasons)}

Provide detailed analysis in markdown format.
`;

    const aiAnalysis = await analyzeWithNvidia(prompt, env);

    return new Response(
      JSON.stringify({
        success: true,
        topStates,
        topCounties,
        topReasons,
        aiAnalysis
      }),
      {
        status: 200,
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
