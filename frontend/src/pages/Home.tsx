import { motion } from "framer-motion";
import InputArea from "@/components/InputArea";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleSubmit = async (response: string) => {
    try {
      const result = JSON.parse(response);
      navigate("/results", { state: { data: result } });  // ← back to state, not URL params
    } catch (err) {
      console.error("Invalid response:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">AccessiBILL</h1>
          <p className="white-text text-lg">Upload any bill, proposal, or initiative, and get your questions answered in seconds.</p>
        </motion.div>

        <InputArea onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Home;