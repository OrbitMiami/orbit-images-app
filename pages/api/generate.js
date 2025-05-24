export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "db21e45a3e738d0db3d265d204127f3f42085b4b26c9c640fe6e31f8b4c6f89c", // SD 1.5 default
      input: {
        prompt: prompt,
      },
    }),
  });

  const prediction = await response.json();

  if (prediction?.detail) {
    return res.status(500).json({ error: prediction.detail });
  }

  res.status(200).json({ image: prediction.urls?.get });
}
