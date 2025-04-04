"use client";

import ThemeSwitcher from "@/components/theme-switcher";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
  
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log(summary)
      if (data.error) {
        setSummary(data.error);
      } else {
        setSummary(data.summary || "Failed to generate summary.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSummary("Error summarizing the document.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen text-green-400 p-5">
      <ThemeSwitcher />
      <h1 className="text-4xl font-bold mb-5">📖 AI Study Assistant</h1>

      <div className="border-2 border-dashed border-green-400 p-10 text-center">
        <label className="cursor-pointer text-xl">
          📂 Drag & Drop or <span className="underline ml-1">Click to Upload</span>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {file && <p className="mt-3 text-lg">Selected File: {file.name}</p>}

      <button
        onClick={handleUpload}
        className="btn btn-primary mt-5"
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Upload & Summarize"}
      </button>

      {summary && (
        <div className="mt-5 p-4 bg-gray-800 w-2/3 text-white">
          <h2 className="text-xl font-bold">Summary:</h2>
          <p className="mt-2">{summary}</p>
        </div>
      )}
    </div>
  );
}
