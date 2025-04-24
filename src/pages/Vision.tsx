import { Part } from "@/lib/models";
import React, { useState, useEffect } from "react";
const Vision: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [boxCount, setBoxCount] = useState(0);
  const [manualCount, setManualCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<number>(-1);
  const [selectedPartQuantity, setSelectedPartQuantity] = useState<number>(0);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [newPart, setNewPart] = useState<Part>({
    id: Math.random(),
    name: "",
    description: "",
    totalQuantity: 0,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setAnnotatedImage(null);
    }
  };

  useEffect(() => {
    fetchParts();
    // try {
    //   updateComponentInfo();
    // } catch (error) {
    //   console.error("Error updating component info:", error);
    //   alert("Failed to update component info. Please try again.");
    // }
  }, []);

  const handleAddPart = () => {
    if (
      newPart.name.trim() === "" ||
      newPart.description.trim() === "" ||
      newPart.totalQuantity <= 0
    ) {
      alert("All fields are required.");
      return;
    }

    const updatedParts = editingPart
      ? parts.map((part) => (part.id === editingPart.id ? newPart : part))
      : [...parts, newPart];

    setParts(updatedParts);
    localStorage.setItem("parts", JSON.stringify(updatedParts));

    setEditingPart(null);
    setNewPart({
      id: Math.random(),
      name: "",
      description: "",
      totalQuantity: 0,
    });
  };

  const [partsLoading, setPartsLoading] = useState(false);
  const [partsError, setPartsError] = useState<string | null>(null);
  const [parts, setParts] = useState<Part[]>([]);

  const fetchParts = async () => {
    setPartsLoading(true);
    setPartsError(null);

    const storedParts = localStorage.getItem("parts");
    if (storedParts) {
      try {
        setParts(JSON.parse(storedParts));
      } catch (error) {
        console.error("Error parsing stored parts:", error);
        setParts([]);
      }
    }
    setPartsLoading(false);
  };

  const handleAddToSelectedPart = () => {
    if (selectedPartId === -1) {
      alert("Please select a part.");
      return;
    }

    const updatedParts = parts.map((part) => {
      if (part.id === selectedPartId) {
        return {
          ...part,
          totalQuantity: part.totalQuantity + manualCount,
        };
      }
      return part;
    });

    setParts(updatedParts);
    localStorage.setItem("parts", JSON.stringify(updatedParts));
    alert("Part quantity updated successfully.");
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Boxes Detected: {boxCount}
          </label>
          <input
            type="number"
            value={manualCount}
            onChange={(e) => setManualCount(Number(e.target.value))}
            className="w-32 px-2 py-1 border border-gray-300 rounded text-black bg-white"
            min={0}
          />
          <p className="text-xs text-gray-500 mt-1">
            You can manually edit the count before submitting.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Part
          </label>
          <select
            className="input w-full px-3 py-2 border border-gray-300 rounded bg-white"
            value={selectedPartId}
            onChange={(e) => setSelectedPartId(Number(e.target.value))}
          >
            <option value="">Select a part...</option>
            {parts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.name} - {part.description}
              </option>
            ))}
          </select>
        </div>

        <button
          className="mt-2 p-2 bg-green-600 text-white rounded"
          onClick={handleAddToSelectedPart}
        >
          Add Count to Selected Part
        </button>
      </div>
    </div>
  );
};

export default Vision;
