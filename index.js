import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const generateImage = async () => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    setImageUrl(data.image);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Orbit Visual Generator</h1>
      <textarea
        style={{ width: "100%", height: 100 }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt"
      />
      <button onClick={generateImage} style={{ marginTop: 10 }}>
        Generate Image
      </button>
      {imageUrl && (
        <div style={{ marginTop: 30 }}>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}
