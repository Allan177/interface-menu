"use client";
import { motion } from "framer-motion";

export default function WelcomeScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-lg"
      >
        Bem Vindo
      </motion.h1>
    </div>
  );
}
