export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'db21e45a3d148f2e4c4f4f3cfef8b6b7b9d7d7cbb6ae201ee1e8f7e4f1b20041', // Update this if you switch models
        input: { prompt }
      })
    });

    const data = await response.json();

    if (response.status !== 201) {
      return res.status(500).json({ error: data.detail || 'Failed to generate image' });
    }

    const getResult = async () => {
      const resultRes = await fetch(data.urls.get, {
        headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
      });
      const resultData = await resultRes.json();

      if (resultData.status === 'succeeded') {
        return resultData.output[0];
      } else if (resultData.status === 'failed') {
        throw new Error('Image generation failed');
      } else {
        return new Promise((resolve) =>
          setTimeout(() => resolve(getResult()), 1000)
        );
      }
    };

    const image = await getResult();
    res.status(200).json({ image });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
