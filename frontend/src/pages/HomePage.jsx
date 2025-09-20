import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Users } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container-home">
      <spline-viewer
        url="https://prod.spline.design/EqBxPY5kUBlXB0Po/scene.splinecode"
        className="spline-bg"
      ></spline-viewer>

      <motion.div
        className="content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="title"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Tic Tac Toe
        </motion.h1>
        <div className="btn-container-home">
          <motion.button
            className="ai-settings-home"
            onClick={() => navigate("/ai-settings")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bot size={20} style={{ marginRight: "8px" }} />
            Play With AI
          </motion.button>

          <motion.button
            className="local-settings-home"
            onClick={() => navigate("/local-settings")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Users size={20} style={{ marginRight: "8px" }} />
            Local Multiplayer
          </motion.button>

          <motion.button
            className="local-settings-home"
            onClick={() => navigate("/lobby")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Users size={20} style={{ marginRight: "8px" }} />
            Play With Friends
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
