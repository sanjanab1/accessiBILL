import { motion } from "framer-motion";
import InputArea from "@/components/InputArea";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleSubmit = (response: string) => {
    //const parsedResponse = JSON.parse(response); // Parse the string back to an object
    navigate("/results", { state: { data: response } });
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
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">AccessiBILL</h1>
          <p className="white-text text-lg">
            Upload any bill, proposal, or initiative, and get your questions answered in seconds.
          </p>
        </motion.div>

        {/* Input */}
        <InputArea onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Home;
