import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Camera, Mic, MicOff, ArrowRight, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzePolicy } from "@/lib/api";

type InputMode = "text" | "upload" | "scan" | "audio";

interface InputAreaProps {
  onSubmit: (content: string) => void;
}

const InputArea = ({ onSubmit }: InputAreaProps) => {
  const [mode, setMode] = useState<InputMode>("text");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [contextText, setContextText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioText, setAudioText] = useState("");
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const scanRef = useRef<HTMLInputElement>(null);

  const modes: { id: InputMode; label: string; icon: React.ReactNode }[] = [
    { id: "text", label: "Text", icon: <FileText size={18} /> },
    { id: "upload", label: "Upload", icon: <Upload size={18} /> },
    { id: "scan", label: "Scan", icon: <Camera size={18} /> },
    { id: "audio", label: "Voice", icon: <Mic size={18} /> },
  ];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setFilePreview(url);
        setText(`[Uploaded image: ${file.name}]`);
      } else if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".csv")) {
        const reader = new FileReader();
        reader.onload = (ev) => setText(ev.target?.result as string || `[Uploaded: ${file.name}]`);
        reader.readAsText(file);
        setFilePreview(null);
      } else {
        setText(`[Uploaded: ${file.name}]`);
        setFilePreview(null);
      }
    }
  };

  const handleScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setScanPreview(url);
      setText(`[Scanned: ${file.name}]`);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setFilePreview(null);
    setText("");
    setContextText("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const clearScan = () => {
    setScanPreview(null);
    setText("");
    if (scanRef.current) scanRef.current.value = "";
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setAudioText("Transcribed audio content would appear here. For now, this is a simulated transcription of your voice input.");
      setText("Transcribed audio content would appear here. For now, this is a simulated transcription of your voice input.");
    } else {
      setIsRecording(true);
      setAudioText("");
    }
  };

  const getSubmitContent = () => {
    if (mode === "upload" && contextText.trim()) {
      return `${text}\n\nContext: ${contextText}`;
    }
    return text;
  };

  const canSubmit = text.trim().length > 0;

  const handleSubmit = async () => {
    try {
      const response = await analyzePolicy({ text }); // Wrap text in an object
      onSubmit(JSON.stringify(response)); // Ensure onSubmit gets a string
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to analyze policy. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Mode Tabs */}
      <div className="flex gap-1 mb-3 bg-secondary rounded-lg p-1 w-fit mx-auto">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === m.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        {mode === "text" && (
          <Textarea
            placeholder="Paste or type your content here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base leading-relaxed placeholder:text-muted-foreground/60"
          />
        )}

        {mode === "upload" && (
          <div className="space-y-3">
            {!fileName ? (
              <div
                className="min-h-[100px] flex flex-col items-center justify-center gap-3 cursor-pointer rounded-lg border-2 border-dashed border-border hover:border-foreground/30 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" className="hidden" onChange={handleFile} accept=".txt,.md,.csv,.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif" />
                <div className="flex gap-2 text-muted-foreground">
                  <Upload size={24} />
                  <Image size={24} />
                </div>
                <p className="text-sm text-muted-foreground">Upload a PDF, image, or document</p>
              </div>
            ) : (
              <div className="relative rounded-lg border border-border p-3">
                <button onClick={clearFile} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
                {filePreview ? (
                  <img src={filePreview} alt="Preview" className="max-h-32 rounded-md mx-auto mb-2 object-contain" />
                ) : null}
                <p className="text-sm text-foreground font-medium truncate pr-6">{fileName}</p>
              </div>
            )}
            <Textarea
              placeholder="Add context or questions about this file… (optional)"
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              className="min-h-[60px] resize-none border border-border rounded-lg bg-transparent focus-visible:ring-1 focus-visible:ring-ring text-sm leading-relaxed placeholder:text-muted-foreground/60"
            />
          </div>
        )}

        {mode === "scan" && (
          <div className="min-h-[140px] flex flex-col items-center justify-center gap-4">
            {!scanPreview ? (
              <>
                <input ref={scanRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScan} />
                <button
                  onClick={() => scanRef.current?.click()}
                  className="w-20 h-20 rounded-full bg-secondary text-foreground hover:bg-secondary/80 flex items-center justify-center transition-all"
                >
                  <Camera size={32} />
                </button>
                <p className="text-sm text-muted-foreground">Tap to scan a document or photo</p>
              </>
            ) : (
              <div className="relative w-full">
                <button onClick={clearScan} className="absolute top-2 right-2 z-10 bg-background/80 rounded-full p-1 text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
                <img src={scanPreview} alt="Scanned" className="max-h-48 rounded-lg mx-auto object-contain" />
              </div>
            )}
          </div>
        )}

        {mode === "audio" && (
          <div className="min-h-[140px] flex flex-col items-center justify-center gap-4">
            <button
              onClick={toggleRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-coral text-white animate-pulse"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <p className="text-sm text-muted-foreground">
              {isRecording ? "Recording… tap to stop" : audioText || "Tap to start recording"}
            </p>
            {audioText && <p className="text-sm text-foreground italic px-4 text-center">{audioText}</p>}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end mt-3 pt-3 border-t border-border">
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!text.trim()}
          >
            Submit <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default InputArea;
