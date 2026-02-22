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

const modeGlow: Record<InputMode, { shadow: string; border: string; activeBg: string; activeText: string }> = {
  text:   {
    shadow:    "0 0 12px 2px hsl(262 60% 58% / 0.55), 0 0 32px 4px hsl(262 60% 58% / 0.25)",
    border:    "hsl(262 60% 58%)",
    activeBg:  "hsl(262 60% 58% / 0.15)",
    activeText:"hsl(262 60% 72%)",
  },
  upload: {
    shadow:    "0 0 12px 2px hsl(172 52% 46% / 0.55), 0 0 32px 4px hsl(172 52% 46% / 0.25)",
    border:    "hsl(172 52% 46%)",
    activeBg:  "hsl(172 52% 46% / 0.15)",
    activeText:"hsl(172 52% 60%)",
  },
  scan:   {
    shadow:    "0 0 12px 2px hsl(38 92% 56% / 0.55), 0 0 32px 4px hsl(38 92% 56% / 0.25)",
    border:    "hsl(38 92% 56%)",
    activeBg:  "hsl(38 92% 56% / 0.15)",
    activeText:"hsl(38 92% 65%)",
  },
  audio:  {
    shadow:    "0 0 12px 2px hsl(4 78% 63% / 0.55), 0 0 32px 4px hsl(4 78% 63% / 0.25)",
    border:    "hsl(4 78% 63%)",
    activeBg:  "hsl(4 78% 63% / 0.15)",
    activeText:"hsl(4 78% 72%)",
  },
};

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
  const scanImageRef = useRef<HTMLInputElement>(null);

  const glow = modeGlow[mode];

  const modes: { id: InputMode; label: string; icon: React.ReactNode }[] = [
    { id: "text",   label: "Text",   icon: <FileText size={18} /> },
    { id: "upload", label: "Upload", icon: <Upload size={18} /> },
    { id: "scan",   label: "Scan",   icon: <Camera size={18} /> },
    { id: "audio",  label: "Voice",  icon: <Mic size={18} /> },
  ];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setFilePreview(url);
        setText(`[Uploaded image: ${file.name}]`);
      } else if (
        file.type.startsWith("text/") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".md") ||
        file.name.endsWith(".csv")
      ) {
        const reader = new FileReader();
        reader.onload = (ev) => setText((ev.target?.result as string) || `[Uploaded: ${file.name}]`);
        reader.readAsText(file);
        setFilePreview(null);
      } else {
        setText(`[Uploaded: ${file.name}]`);
        setFilePreview(null);
      }
    }
  };

  const handleScanImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setScanPreview(url);
      setScanTextContent(null);
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
    if (scanImageRef.current) scanImageRef.current.value = "";
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      const simulated =
        "Transcribed audio content would appear here. For now, this is a simulated transcription of your voice input.";
      setAudioText(simulated);
      setText(simulated);
    } else {
      setIsRecording(true);
      setAudioText("");
    }
  };

  const canSubmit = text.trim().length > 0;

  const handleSubmit = async () => {
    try {
      const requestData = text; // Send raw input directly
      const response = await analyzePolicy({ input_data: requestData }); // Wrap raw input in an object
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
        {modes.map((m) => {
          const isActive = mode === m.id;
          const mg = modeGlow[m.id];
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={
                isActive
                  ? {
                      backgroundColor: mg.activeBg,
                      color: mg.activeText,
                      boxShadow: mg.shadow,
                      border: `1px solid ${mg.border}`,
                    }
                  : {}
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = mg.shadow;
                  (e.currentTarget as HTMLButtonElement).style.color = mg.activeText;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
                  (e.currentTarget as HTMLButtonElement).style.color = "";
                }
              }}
            >
              {m.icon}
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Input Area */}
      <div
        className="bg-card rounded-xl p-4 shadow-sm transition-all duration-300"
        style={{
          border: `1px solid ${glow.border}`,
          boxShadow: glow.shadow,
        }}
      >
        {/* TEXT MODE */}
        {mode === "text" && (
          <Textarea
            placeholder="Paste or type your content and question here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base leading-relaxed placeholder:text-muted-foreground/60"
          />
        )}

        {/* UPLOAD MODE */}
        {mode === "upload" && (
          <div className="space-y-3">
            {!fileName ? (
              <div
                className="min-h-[100px] flex flex-col items-center justify-center gap-3 cursor-pointer rounded-lg border-2 border-dashed transition-colors"
                style={{ borderColor: `${glow.border}55` }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor = glow.border)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor = `${glow.border}55`)
                }
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={handleFile}
                  accept=".txt,.md,.csv,.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif"
                />
                <div className="flex gap-2 text-muted-foreground">
                  <Upload size={24} />
                  <Image size={24} />
                </div>
                <p className="text-sm text-muted-foreground">Upload a PDF, image, or document</p>
              </div>
            ) : (
              <div className="relative rounded-lg border border-border p-3">
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
                {filePreview && (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-32 rounded-md mx-auto mb-2 object-contain"
                  />
                )}
                <p className="text-sm text-foreground font-medium truncate pr-6">{fileName}</p>
              </div>
            )}
            <Textarea
              placeholder="Add context or questions about this file…"
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              className="min-h-[60px] resize-none border border-border rounded-lg bg-transparent focus-visible:ring-1 focus-visible:ring-ring text-sm leading-relaxed placeholder:text-muted-foreground/60"
            />
          </div>
        )}

        {/* SCAN MODE */}
        {mode === "scan" && (
          <div className="flex flex-col gap-3">
            {/* Camera button / preview */}
            <div className="flex flex-col items-center gap-3">
              <input
                ref={scanImageRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleScanImage}
              />
              {scanPreview ? (
                <div className="relative w-full">
                  <button
                    onClick={clearScan}
                    className="absolute top-2 right-2 z-10 bg-background/80 rounded-full p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                  <img
                    src={scanPreview}
                    alt="Scanned"
                    className="max-h-48 rounded-lg mx-auto object-contain"
                  />
                </div>
              ) : (
                <>
                  <button
                    onClick={() => scanImageRef.current?.click()}
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{ backgroundColor: glow.activeBg, color: glow.activeText }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.boxShadow = glow.shadow)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.boxShadow = "")
                    }
                  >
                    <Camera size={32} />
                  </button>
                  <p className="text-sm text-muted-foreground">Tap to open camera or upload a photo</p>
                </>
              )}
            </div>

            {/* Context text box */}
            <Textarea
              placeholder="Add context or questions about this scan…"
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              className="min-h-[60px] resize-none border border-border rounded-lg bg-transparent focus-visible:ring-1 focus-visible:ring-ring text-sm leading-relaxed placeholder:text-muted-foreground/60"
            />
          </div>
        )}

        {/* AUDIO MODE */}
        {mode === "audio" && (
          <div className="min-h-[140px] flex flex-col items-center justify-center gap-4">
            <button
              onClick={toggleRecording}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200"
              style={
                isRecording
                  ? {
                      backgroundColor: modeGlow.audio.activeBg,
                      color: modeGlow.audio.activeText,
                      boxShadow: modeGlow.audio.shadow,
                      animation: "pulse 1.5s infinite",
                    }
                  : { backgroundColor: glow.activeBg, color: glow.activeText }
              }
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.boxShadow = glow.shadow)
              }
              onMouseLeave={(e) => {
                if (!isRecording)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
              }}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <p className="text-sm text-muted-foreground">
              {isRecording ? "Recording… tap to stop" : audioText || "Tap to start recording"}
            </p>
            {audioText && (
              <p className="text-sm text-foreground italic px-4 text-center">{audioText}</p>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end mt-3 pt-3 border-t border-border">
          <Button
            onClick={handleSubmit}
            className="w-full transition-all duration-200"
            disabled={!canSubmit}
            style={
              canSubmit
                ? {
                    backgroundColor: glow.activeBg,
                    color: glow.activeText,
                    border: `1px solid ${glow.border}`,
                  }
                : {}
            }
            onMouseEnter={(e) => {
              if (canSubmit)
                (e.currentTarget as HTMLButtonElement).style.boxShadow = glow.shadow;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
            }}
          >
            Submit <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default InputArea;