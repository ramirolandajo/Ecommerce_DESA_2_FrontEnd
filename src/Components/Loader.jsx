import React from 'react';
import { motion } from "framer-motion";

export default function Loader() {
    return (
        <div className="flex items-center justify-center p-6" data-testid="loader">
            <motion.div
                className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
        </div>
    );
}
