import React, { useState } from "react";

const Vision: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [boxCount, setBoxCount] = useState(0);
  const [manualCount, setManualCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setAnnotatedImage(null);
    }
  };

  const drawBoxesOnImage = async (imageUrl: string, predictions: any[]) => {
    const img = new Image();
    img.src = imageUrl;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";

    predictions.forEach((pred) => {
      const { x, y, width, height, confidence, class: label } = pred;
      const x0 = x - width / 2;
      const y0 = y - height / 2;

      ctx.strokeRect(x0, y0, width, height);
      ctx.fillText(`${label} (${confidence.toFixed(2)})`, x0, y0 - 5);
    });

    const dataUrl = canvas.toDataURL();
    setAnnotatedImage(dataUrl);
  };

  const handleInference = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch(
        "https://detect.roboflow.com/box-counting/4?api_key=JV3IU2faMOiNmuSsyyY4",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();
      const predictions = result.predictions;

      setBoxCount(predictions.length);
      setManualCount(predictions.length);

      if (preview) {
        await drawBoxesOnImage(preview, predictions);
      }
    } catch (error) {
      console.error("Inference error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setImage(null);
    setPreview(null);
    setAnnotatedImage(null);
    setBoxCount(0);
    setManualCount(0);
    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen p-8 w-screen">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-black mb-4">Vision Page</h1>

        <div className="mb-4">
          <input
            type="file"
            onChange={handleImageChange}
            className="mb-4 p-2 border border-gray-300"
          />
          <button
            onClick={handleInference}
            className="p-2 bg-blue-500 text-white rounded mr-2"
            disabled={loading}
          >
            {loading ? "Processing..." : "Run Inference"}
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 bg-gray-400 text-white rounded"
          >
            Refresh
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center my-6">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Side-by-side images */}
        {preview && annotatedImage && (
          <div className="flex justify-center gap-8 items-start mb-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Image Preview</h2>
              <img
                src={preview}
                alt="Preview"
                style={{ width: "100%" }}
                className="border border-gray-300 inline-block"
              />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Annotated Image</h2>
              <img
                src={annotatedImage}
                alt="Annotated"
                style={{ width: "100%" }}
                className="border border-gray-300 inline-block"
              />
            </div>
          </div>
        )}

        <div className="mt-4">
          <h3 className="font-medium">Boxes Detected: {boxCount}</h3>
        </div>
      </div>
    </div>
  );
};

export default Vision;
