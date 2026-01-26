'use client';
import { motion } from 'framer-motion';

export default function ProgressBar({ progress }) {
    return (
        <div className="w-full h-[2px] bg-gray-200 mt-6 relative">
            <motion.div
                className="absolute top-0 left-0 h-full bg-[#c5a365]" // ゴールド系
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
            />
        </div>
    );
}