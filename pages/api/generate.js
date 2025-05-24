export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.NEW_REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "a9758cb5b621b65f5569f742fe1d29d34eeb6c3e9c84d9383ab8a0011c1591e3", // Replace with the correct model version
        input: { prompt }
      })
    });

    if (!replicateResponse.ok) {
      const error = await replicateResponse.json();
      return res.status(500).json({ error: error.detail || 'Replicate error' });
    }

    const prediction = await replicateResponse.json();
    res.status(200).json({ image: prediction.output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
