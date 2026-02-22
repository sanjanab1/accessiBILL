import { motion } from "framer-motion";
import { ExternalLink, BarChart3, CheckCircle2, Lightbulb, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const mockData = [
  { label: "Clarity", value: 85 },
  { label: "Completeness", value: 72 },
  { label: "Accuracy", value: 91 },
  { label: "Relevance", value: 68 },
];

const barColors = [
  //"hsl(4, 78%, 63%)",
  "hsl(172, 52%, 46%)",
  "hsl(38, 92%, 56%)",
  "hsl(262, 60%, 58%)",
];

interface SummaryOutputProps {
  data: Record<string, unknown>;
}

const SummaryOutput = ({ data }: SummaryOutputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto mt-10 space-y-6"
    >
      {data.summary && (
        <div className="p-4 bg-muted rounded-lg">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <Lightbulb size={18} /> Bill Analysis
          </h2>
          <p className="text-sm leading-relaxed">{String(data.summary)}</p>
        </div>
      )}
    </motion.div>
  );
};

export default SummaryOutput;
