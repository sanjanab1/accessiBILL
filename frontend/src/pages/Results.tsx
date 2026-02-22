import { motion } from "framer-motion";
import SummaryOutput from "@/components/SummaryOutput";
import InputArea from "@/components/InputArea";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";
import { getPlotData } from "@/lib/api";
import CameraOCR from "@/components/Camera";
import { analyzePolicy } from "@/lib/api";


const levelColor: Record<string, string> = {
  none: "bg-gray-100 text-gray-500",
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const Results = () => {
  const [data, setData] = useState(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const location = useLocation();
  const initialData = location.state?.data;

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

  useEffect(() => {
    if (!data) return;

    const fetchAndRenderPlots = async () => {
      try {
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
        {!data && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
<<<<<<< HEAD
            ← Start over
          </button>
          
          {/* Bill Analysis */}
          <SummaryOutput data={data} />

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
        
          <div ref={chart1Ref} className="mt-8 w-full" />
          <div ref={chart2Ref} className="mt-8 w-full" />
        </motion.div>
=======
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">AccessiBILL</h1>
            <p className="white-text text-lg">
              Upload any bill, proposition, or initiative, and get your questions answered in seconds!
            </p>
          </motion.div>
        )}

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

            {data.personalized_impact && (
              <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-2">Your Personalized Impact</h2>
                <p className="text-muted-foreground leading-relaxed">{data.personalized_impact}</p>
              </div>
            )}

            {data.impact_tags && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Impact by Category</h2>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(data.impact_tags).map(([category, level]) => (
                    <div
                      key={category}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 ${levelColor[level] ?? "bg-gray-100"}`}
                    >
                      <span className="capitalize font-medium">{category}</span>
                      <span className="capitalize text-sm font-semibold">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <SummaryOutput data={data} />
            <div ref={chart1Ref} className="mt-8 w-full" />
            <div ref={chart2Ref} className="mt-8 w-full" />
          </motion.div>
        )}
>>>>>>> origin/nj
      </div>
    </div>
  );
};

export default Results;
