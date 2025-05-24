export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: "Token r8_7IowDr1xcbSHXI79SXoWlvvS4wgW9ee49HZkT",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "db21e45a3d07c61cfc5d70b95a180504c4c7e6c347510e3c36c6c597dfc5d447", // Stable Diffusion 1.5
      input: { prompt },
    }),
  });

  const result = await response.json();

  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  const getFinal = async () => {
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: {
        Authorization: "Token r8_7IowDr1xcbSHXI79SXoWlvvS4wgW9ee49HZkT",
      },
    });
    return poll.json();
  };

  let output;
  for (let i = 0; i < 20; i++) {
    const finalResult = await getFinal();
    if (finalResult.status === "succeeded") {
      output = finalResult.output[0];
      break;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (!output) {
    return res.status(500).json({ error: "Image generation failed or timed out." });
  }

  res.status(200).json({ image: output });
}
