import { motion } from "framer-motion";
import SummaryOutput from "@/components/SummaryOutput";
import { useLocation } from "react-router-dom";

const Results = () => {
  const handleReset = () => {
    // Navigate back to the home page
    window.location.href = "/";
  };

  const location = useLocation();
  const data = location.state?.data;

  return (
    <div className="min-h-screen bg-background px-4 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={handleReset}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 mb-4 block mx-auto"
          >
            ← Start over
          </button>
          <SummaryOutput data={data} />
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
