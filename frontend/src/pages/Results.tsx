import { motion } from "framer-motion";
import SummaryOutput from "@/components/SummaryOutput";
import { useLocation } from "react-router-dom";
import InputArea from "@/components/InputArea";
import { useState, useRef } from "react";

const Results = () => {
  const [data, setData] = useState(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (response: string) => {
    try {
      const parsedData = JSON.parse(response);
      setData(parsedData);
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Failed to parse response:", error);
    }
  };

  const location = useLocation();
  const initialData = location.state?.data;

  return (
    <div className="min-h-screen bg-background px-4 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">AccessiBILL</h1>
          <p className="white-text text-lg">
            Upload any bill, proposal, or initiative, and get your questions answered in seconds.
          </p>
        </motion.div>

        {/* Input Area */}
        {!data ? (
          <InputArea onSubmit={handleSubmit} />
        ) : (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => setData(null)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 mb-4 block mx-auto"
            >
              ← Start over
            </button>
            <SummaryOutput data={data} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Results;
