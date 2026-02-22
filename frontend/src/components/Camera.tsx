import { useEffect, useRef, useState } from "react";
import { extractText } from "@/lib/api";

const CameraOCR = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Start camera on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });

    // Listen for 's' key
    const handleKey = (e) => {
      if (e.key === "s") takeSnapshot();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const takeSnapshot = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      setLoading(true);
      try {
        const result = await extractText(blob);
        setText(result.text);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <video ref={videoRef} autoPlay className="rounded-lg w-full max-w-lg" />
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={takeSnapshot}
        className="px-4 py-2 bg-primary text-white rounded-lg"
      >
        {loading ? "Processing..." : "Snapshot (or press S)"}
      </button>
      {text && (
        <div className="w-full max-w-lg p-4 bg-muted rounded-lg whitespace-pre-wrap">
          {text}
        </div>
      )}
    </div>
  );
};

export default CameraOCR;