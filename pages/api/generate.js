export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.ORBITS_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: "d2e964a3-cb06-49f7-a58e-7c9b6c451dd4", // SDXL or any known working version
      input: {
        prompt: prompt
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({ error: data.detail || 'Failed to generate image' });
  }

  res.status(200).json(data);
}
