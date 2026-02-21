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
  "hsl(4, 78%, 63%)",
  "hsl(172, 52%, 46%)",
  "hsl(38, 92%, 56%)",
  "hsl(262, 60%, 58%)",
];

const SummaryOutput = () => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto mt-10 space-y-6"
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-3xl font-medium tracking-tight mb-2">Summary</h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Here's a plain-language breakdown of your content, organized by key themes and takeaways.
        </p>
      </motion.div>

      {/* Key Findings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="highlight-teal">
        <div className="flex items-start gap-2">
          <CheckCircle2 size={18} className="text-teal mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-base mb-1">Key Findings</h3>
            <ul className="space-y-1.5 text-sm leading-relaxed">
              <li>• The primary argument centers on improving accessibility across digital platforms</li>
              <li>• Three case studies demonstrate measurable impact on user engagement</li>
              <li>• Recommendations align with WCAG 2.1 AA compliance standards</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Important Note */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="highlight-coral">
        <div className="flex items-start gap-2">
          <AlertTriangle size={18} className="text-coral mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-base mb-1">Attention Required</h3>
            <p className="text-sm leading-relaxed">
              Some data points reference outdated benchmarks from 2019. Consider cross-referencing with current industry standards.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="highlight-amber">
        <div className="flex items-start gap-2">
          <Lightbulb size={18} className="text-amber mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-base mb-1">Insights</h3>
            <ul className="space-y-1.5 text-sm leading-relaxed">
              <li>• Serif typography tested 12% better for readability in long-form content</li>
              <li>• Color contrast improvements led to 23% longer session durations</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Data Visualization */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-muted-foreground" />
          <h3 className="font-semibold text-base">Content Analysis Score</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockData} barSize={36}>
            <XAxis dataKey="label" tick={{ fontSize: 13, fontFamily: "var(--font-serif)" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                fontFamily: "var(--font-serif)",
                borderRadius: "8px",
                border: "1px solid hsl(40, 12%, 88%)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {mockData.map((_, i) => (
                <Cell key={i} fill={barColors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="highlight-violet">
        <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
          <ExternalLink size={16} className="text-violet" />
          Related Resources
        </h3>
        <ul className="space-y-1.5 text-sm">
          <li>
            <a href="#" className="text-violet underline underline-offset-2 hover:opacity-80 transition-opacity">
              WCAG 2.1 Guidelines — W3C
            </a>
          </li>
          <li>
            <a href="#" className="text-violet underline underline-offset-2 hover:opacity-80 transition-opacity">
              Digital Accessibility Best Practices — A11y Project
            </a>
          </li>
          <li>
            <a href="#" className="text-violet underline underline-offset-2 hover:opacity-80 transition-opacity">
              Typography & Readability Research — Nielsen Norman Group
            </a>
          </li>
        </ul>
      </motion.div>

      {/* Footer */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-xs text-muted-foreground text-center pt-4 pb-8">
        This summary was generated from your input. Results are illustrative and may need verification.
      </motion.p>
    </motion.div>
  );
};

export default SummaryOutput;
