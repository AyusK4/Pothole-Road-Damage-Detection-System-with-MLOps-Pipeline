import { useMemo, useState } from "react";

const DEFAULT_API_URL = "http://localhost:5000";

function App() {
  const apiUrl = useMemo(() => {
    return import.meta.env.VITE_API_URL || DEFAULT_API_URL;
  }, []);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFileChange = (event) => {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    setResultImage("");
    setDetections([]);
    setError("");

    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl("");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please choose an image.");
      return;
    }

    setLoading(true);
    setError("");
    setResultImage("");
    setDetections([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Prediction failed.");
      }

      const payload = await response.json();
      setResultImage(`data:image/png;base64,${payload.image_base64}`);
      setDetections(payload.detections || []);
    } catch (err) {
      setError(err.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <h1>Road Damage Detection</h1>
        <p>Upload a road image to detect potholes and surface damage.</p>
      </header>

      <main className="content">
        <section className="panel">
          <form onSubmit={onSubmit} className="form">
            <label className="file-input">
              <input type="file" accept="image/*" onChange={onFileChange} />
              <span>{file ? file.name : "Choose an image"}</span>
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Running..." : "Run Detection"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          <div className="preview-grid">
            <div>
              <h2>Original</h2>
              {previewUrl ? (
                <img src={previewUrl} alt="Original preview" />
              ) : (
                <div className="placeholder">No image selected</div>
              )}
            </div>
            <div>
              <h2>Predictions</h2>
              {resultImage ? (
                <img src={resultImage} alt="Predicted preview" />
              ) : (
                <div className="placeholder">No predictions yet</div>
              )}
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Detections</h2>
          {detections.length === 0 ? (
            <p className="muted">No detections to show.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Confidence</th>
                  <th>Box (x1, y1, x2, y2)</th>
                </tr>
              </thead>
              <tbody>
                {detections.map((det, idx) => (
                  <tr key={`${det.class_id}-${idx}`}>
                    <td>{det.class_name}</td>
                    <td>{det.confidence.toFixed(3)}</td>
                    <td>{det.box.map((v) => v.toFixed(1)).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
