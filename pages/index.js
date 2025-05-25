import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setError("");
    setImageUrl(null);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (response.ok) {
      setImageUrl(data.image);
    } else {
      setError(data.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <h1>Orbit Visual Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt"
        style={{ width: "300px", padding: "10px" }}
      />
      <br /><br />
      <button onClick={generateImage} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageUrl && (
        <div style={{ marginTop: 30 }}>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}
