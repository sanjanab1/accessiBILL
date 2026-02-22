import { useEffect, useRef, useState } from "react";
import { extractText } from "@/lib/api";

interface CameraOCRProps {
  onCapture?: (file: File, summary: string) => void;
  standalone?: boolean;
}

const CameraOCR = ({ onCapture, standalone = true }: CameraOCRProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "s") takeSnapshot();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      // stop camera on unmount
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const takeSnapshot = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setLoading(true);
      try {
        const file = new File([blob], "snapshot.jpg", { type: "image/jpeg" });
        const result = await extractText(file);
        setText(result.summary);
        
        // if used inside InputArea, pass back up
        if (onCapture) onCapture(file, result.summary);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <video ref={videoRef} autoPlay className="rounded-lg w-full" />
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={takeSnapshot}
        className="px-4 py-2 bg-primary text-black rounded-lg w-full"
      >
        {loading ? "Processing..." : "Snapshot (or press S)"}
      </button>
      {standalone && text && (
        <div className="w-full p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
          {text}
        </div>
      )}
    </div>
  );
};

export default CameraOCR;