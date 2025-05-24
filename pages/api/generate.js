export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const prompt = req.body.prompt;
  const replicateApiToken = process.env.NEW_REPLICATE_API_TOKEN;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${replicateApiToken}`,
    },
    body: JSON.stringify({
      version: "db21e45e52a8cde1c5eaa2d2cf733c22d05e695b38f324c43cb65c809ae200c6", // stable-diffusion 1.5
      input: { prompt },
    }),
  });

  const data = await response.json();

  if (response.status !== 201) {
    return res.status(500).json({ error: data.detail || "Error generating image" });
  }

  const prediction = data;

  // Poll until the image is ready
  let output = null;
  while (!output && prediction.status !== "failed") {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {
        Authorization: `Token ${replicateApiToken}`,
      },
    });

    const pollData = await pollRes.json();
    if (pollData.status === "succeeded") {
      output = pollData.output[0]; // Get first image URL
    }
  }

  if (!output) {
    return res.status(500).json({ error: "Image generation failed" });
  }

  res.status(200).json({ image: output });
}
