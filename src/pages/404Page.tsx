import { motion } from "framer-motion";

const PageNotFound = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const characterAnimation = {
        idle: {
            y: [0, -10, 0],
            transition: {
                y: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                }
            }
        }
    };

    const questionMarkAnimation = {
        animate: {
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
            transition: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="w-full relative h-70vh overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-blue-500/20 dark:bg-blue-400/20 blur-3xl"></div>
            <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-rose-500/20 dark:bg-rose-400/20 blur-3xl"></div>

            <div className="max-w-md  mx-auto px-4 sm:px-6 py-8 relative z-10 text-center">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="mb-6"
                >
                    <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tight text-indigo-400 dark:text-indigo-500 mb-4">404</h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="w-full h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent my-6"
                    ></motion.div>
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative w-64 h-64">
                        <motion.div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                            animate="idle"
                            variants={characterAnimation}
                        >
                            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                                <motion.circle cx="60" cy="60" r="30" fill="#6366f1" />
                                <circle cx="50" cy="55" r="5" fill="white" />
                                <circle cx="70" cy="55" r="5" fill="white" />
                                <circle cx="50" cy="55" r="2" fill="#1e1e1e" />
                                <circle cx="70" cy="55" r="2" fill="#1e1e1e" />
                                <path d="M45 70 Q60 65 75 70" stroke="white" strokeWidth="2" fill="transparent" />
                            </svg>
                        </motion.div>

                        <motion.div
                            className="absolute top-0 right-0"
                            variants={questionMarkAnimation}
                            animate="animate"
                        >
                            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <text x="10" y="35" fontSize="30" fill="#6366f1">?</text>
                            </svg>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-0 left-0"
                            variants={questionMarkAnimation}
                            animate="animate"
                            transition={{ delay: 0.5 }}
                        >
                            <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                <text x="8" y="25" fontSize="25" fill="#6366f1">?</text>
                            </svg>
                        </motion.div>

                        <motion.div
                            className="absolute top-10 left-5"
                            variants={questionMarkAnimation}
                            animate="animate"
                            transition={{ delay: 1 }}
                        >
                            <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                                <text x="7" y="20" fontSize="20" fill="#6366f1">?</text>
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">The page you're looking for doesn't exist or has been moved.</p>
                    <motion.a
                        href="/"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
                    >
                        Go Home
                    </motion.a>
                </motion.div>
            </div>
        </div>
    );
};

export default PageNotFound;