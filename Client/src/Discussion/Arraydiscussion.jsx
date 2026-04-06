import { motion } from "framer-motion";

function Arraydiscussion() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center relative overflow-hidden">

            {/* Soft background glow */}
            <div className="absolute w-[300px] h-[300px] bg-[#6366f1]/10 rounded-full blur-3xl"></div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                {/* Title */}
                <h1 className="text-4xl font-semibold tracking-wide text-white mb-3">
                    Coming Soon
                </h1>

                {/* Subtitle */}
                <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                    We’re working on something powerful. Discussion features  will be available soon.
                </p>

                {/* Animated Loader */}
                <div className="flex justify-center mt-8 gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="w-2.5 h-2.5 bg-[#6366f1] rounded-full"
                            animate={{
                                y: [0, -10, 0],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default Arraydiscussion;