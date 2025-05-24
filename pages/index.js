import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImageUrl(null);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (response.ok && data?.output) {
      setImageUrl(data.output);
    } else {
      setError(data.error || 'Failed to generate image');
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Orbit Visual Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
          style={{ width: '300px', padding: '10px' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '10px' }}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <img src={imageUrl} alt="Generated result" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}
