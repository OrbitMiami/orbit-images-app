export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "db21e45a3f8f2e4c60f8b4b78aa31edc7016bcdde80e7e294a0ec66fdd1d7509",
      input: { prompt }
    })
  });

  const data = await response.json();

  if (response.ok) {
    res.status(200).json({ image: data.output[data.output.length - 1] });
  } else {
    res.status(500).json({ error: data.detail });
  }
}
