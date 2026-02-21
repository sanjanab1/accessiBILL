import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputArea from "@/components/InputArea";
import SummaryOutput from "@/components/SummaryOutput";

const Index = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (_content: string) => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
  };

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
          <h1 className="text-5xl md:text-6xl tracking-tight mb-3">Distill</h1>
          <p className="text-muted-foreground text-lg">
            Drop in anything. Get clarity back.
          </p>
        </motion.div>

        {/* Input */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="input" exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}>
              <InputArea onSubmit={handleSubmit} />
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <button
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 mb-4 block mx-auto"
              >
                ← Start over
              </button>
              <SummaryOutput />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
