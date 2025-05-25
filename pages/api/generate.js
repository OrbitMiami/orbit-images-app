// pages/api/generate.js
export default async function handler(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      }),
    });

    const json = await openaiRes.json();

    if (json.error) {
      return res.status(500).json({ error: json.error.message });
    }

    res.status(200).json({ image: json.data[0].url });
  } catch (error) {
    res.status(500).json({ error: 'Image generation failed' });
  }
}
