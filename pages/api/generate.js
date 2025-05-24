export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "db21e45d3b8045be9d82a216aef1b01163e259f0c3d8e8d011c1e3f5363c4a17",
      input: {
        prompt: prompt || "floating SphereBot with glowing eyes over water",
      },
    }),
  });

  const json = await response.json();
  const image = json?.output?.[0] || null;

  res.status(200).json({ image });
}
