import { motion } from "framer-motion";
import SummaryOutput from "@/components/SummaryOutput";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Plotly from 'plotly.js-dist-min';

import { getPlotData } from "@/lib/api";
import CameraOCR from "@/components/Camera";
import { analyzePolicy } from "@/lib/api";


const levelColor : Record<string, string> = {
  none: "bg-gray-100 text-gray-500",
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};


const Results = () => {
  const location = useLocation();
  const data = location.state?.data;
  //const summary = useRef(null);
  //const state = useRef(null);
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const impact = data?.personalized_impact;
  const tags = data?.impact_tags;

  

  const handleReset = () => {
    // Navigate back to the home page
    window.location.href = "/";
  };

  //call useffect to get state and bill summary + display

  useEffect(() => {
    if (!data) return;

    const fetchAndRenderPlots = async () => {
      try {
        //replace with state and summary
        const plots = await getPlotData(data.state, data.bill_summary);
        
        if (chart1Ref.current) {
          Plotly.newPlot(chart1Ref.current, plots.crime_plot.data, plots.crime_plot.layout);
        }
        if (chart2Ref.current) {
          Plotly.newPlot(chart2Ref.current, plots.tax_plot.data, plots.tax_plot.layout);
        }
      } catch (error) {
        console.error("Error getting plot data:", error);
      }
    };

    fetchAndRenderPlots();
  }, [data]);


  return (
    <div className="min-h-screen bg-background px-4 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        {/* Results */}
        <CameraOCR />
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
          
          {/* Impact Summary */}
          {impact && (
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Your Personalized Impact</h2>
              <p className="text-muted-foreground leading-relaxed">{impact}</p>
            </div>
          )}

          {/* Impact Tags */}
          {tags && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Impact by Category</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(tags).map(([category, level]) => (
                  <div
                    key={category}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 ${levelColor[level as string] ?? "bg-gray-100"}`}
                  >
                    <span className="capitalize font-medium">{category}</span>
                    <span className="capitalize text-sm font-semibold">{level as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <SummaryOutput data={data} />
          <div ref={chart1Ref} className="mt-8 w-full" />
          <div ref={chart2Ref} className="mt-8 w-full" />
        </motion.div>
      </div>
    </div>
  );
};

export default Results;