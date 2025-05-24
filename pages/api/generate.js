export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.NEW_REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "db21e45a3b8c8b3a6a9cb0fdb502d5fdc78f7c3df6b9af64072f78d1dfde99f3", // default SD 1.5
      input: { prompt },
    }),
  });

  const prediction = await response.json();

  if (prediction?.error) {
    return res.status(500).json({ error: prediction.error });
  }

  // Wait for the image to be generated
  let image = null;
  while (!image && prediction.status !== "failed") {
    await new Promise(r => setTimeout(r, 1000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { Authorization: `Token ${process.env.NEW_REPLICATE_API_TOKEN}` }
    });
    const result = await poll.json();
    image = result.output?.[0];
    if (result.status === "succeeded") break;
  }

  res.status(200).json({ image });
}
