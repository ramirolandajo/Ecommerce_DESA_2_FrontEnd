import React from "react";
import { motion } from "framer-motion";

export default function ProductSkeleton() {
  return (
    <motion.div
      className="rounded-2xl border border-zinc-200 p-5 shadow-md"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    >
      <div className="h-40 w-full rounded-xl bg-zinc-200" />
      <div className="mt-4 h-4 w-3/4 rounded bg-zinc-200" />
      <div className="mt-2 h-4 w-1/2 rounded bg-zinc-200" />
      <div className="mt-6 h-6 w-24 rounded-full bg-zinc-200" />
    </motion.div>
  );
}

