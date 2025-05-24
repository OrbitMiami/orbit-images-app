import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    setLoading(true);
    setError('');
    setImage(null);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (res.ok) {
      setImage(data.image);
    } else {
      setError(data.error || 'Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1><strong>Orbit Visual Generator</strong></h1>
      <input
        type="text"
        placeholder="Enter a prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '300px', padding: '10px', fontSize: '16px' }}
      />
      <br /><br />
      <button onClick={generateImage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      <br /><br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image && <img src={image} alt="Generated" style={{ maxWidth: '100%' }} />}
    </div>
  );
}
