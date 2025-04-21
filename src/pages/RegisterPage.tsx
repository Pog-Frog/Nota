import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import bgImage from "../assets/bg_1.png";
import GoogleSvg from "../assets/google.svg";
import { useAuthStore } from "../store/AuthStore";
import { object, string, ValidationError, ref } from "yup";
import { toast } from "react-toastify";

const SignupPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuthStore();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const registerSchema = object({
        fullName: string().required("Full name is required").min(3, "Full name must be at least 3 characters"),
        email: string().email("Invalid email format").required("Email is required"),
        password: string().min(8, "Password must be at least 8 characters").matches(/[a-zA-Z]/, "Password must contain a letter").required("Password is required"),
        confirmPassword: string().oneOf([ref("password")], "Passwords must match").required("Confirm password is required"),
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }
        , [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            await registerSchema.validate({ fullName, email, password, confirmPassword }, { abortEarly: false });

        } catch (err) {
            if (err instanceof ValidationError) {
                const formattedErrors: Record<string, string> = {};
                err.inner.forEach(error => {
                    if (error.path) {
                        formattedErrors[error.path] = error.message;
                    }
                });
                setErrors(formattedErrors);
                toast.error("Please fix the errors in the form.");
                setIsLoading(false);
                return;
            }

            console.error("Unexpected validation error:", err);
            toast.error("An unexpected error occurred during validation.");
            setIsLoading(false);
            return;
        }

        try {
            await register(email, password, fullName);
            navigate("/");
        } catch (error) {
            console.log("Login failed:", error);
        }
    };

    // const handleGoogleSignup = () => {
    //     setIsLoading(true);
    //     setTimeout(() => {
    //         setIsLoading(false);
    //         console.log("Signup with Google");
    //     }, 1500);
    // };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-black overflow-hidden"
        >
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0"
                />
                <div
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                    style={{ backgroundImage: `url(${bgImage})` }}
                ></div>

                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 7,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-40 right-1/4 w-96 h-96 rounded-full bg-rose-500/20 blur-3xl"
                />

                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 180, ease: "linear", repeat: Infinity }}
                    className="absolute left-[10%] top-[20%]"
                >
                    <svg width="100" height="100" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M90.8645 4.75663C92.321 -0.678541 100.033 -0.678551 101.49 4.75661L102.15 7.22234C112.943 47.4984 144.439 78.9351 184.735 89.653L187.328 90.3428C192.776 91.7919 192.777 99.524 187.328 100.973L184.735 101.663C144.439 112.381 112.943 143.818 102.15 184.094L101.49 186.559C100.033 191.995 92.321 191.995 90.8645 186.559L90.2038 184.094C79.4108 143.818 47.9155 112.381 7.6194 101.663L5.02604 100.973C-0.422331 99.524 -0.422342 91.7919 5.02602 90.3428L7.61938 89.653C47.9155 78.9351 79.4108 47.4984 90.2038 7.22236L90.8645 4.75663Z"
                            fill="#F1F3F4" stroke="white" strokeOpacity="0.3" className="dark:fill-gray-800 dark:stroke-gray-600 fill-black stroke-black" />
                    </svg>
                </motion.div>

                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity
                    }}
                    className="absolute right-[20%] bottom-[25%]"
                >
                    <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.2647 2.20869C17.4327 0.569841 19.8236 0.569832 19.9915 2.20869C20.783 9.93246 26.9003 16.0471 34.627 16.8197C36.265 16.9835 36.2649 19.3708 34.627 19.5346C26.9003 20.3072 20.783 26.4218 19.9915 34.1456C19.8236 35.7845 17.4327 35.7844 17.2647 34.1456C16.4732 26.4218 10.3559 20.3072 2.62927 19.5346C0.99132 19.3708 0.991314 16.9835 2.62927 16.8197C10.3559 16.0471 16.4732 9.93246 17.2647 2.20869Z"
                            fill="#F1F3F4" stroke="white" strokeOpacity="0.3" className="dark:fill-gray-800 dark:stroke-gray-600 fill-black stroke-black" />
                    </svg>
                </motion.div>

                <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-gray-900 dark:text-white mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-4xl font-bold mb-6"
                    >
                        Join Us Today
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-xl max-w-md text-center"
                    >
                        Begin your creative journey with us and start crafting engaging stories.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl"
                    >
                        <h1 className="text-3xl font-extrabold">
                            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-gray-700 dark:text-white">
                                Your Story Begins
                            </span>
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* Right side */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative mb-10"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent lg:hidden -z-10"></div>

                <div className="absolute top-0 right-0 w-full h-48 overflow-hidden lg:hidden -z-10">
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 5
                        }}
                        className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 10, 0],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 7,
                            delay: 1
                        }}
                        className="absolute top-0 left-1/4 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl"
                    />
                </div>

                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="block lg:hidden text-center mb-12"
                    >
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            <span className="bg-gradient-to-tl from-indigo-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">
                                Sign up
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-10"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Join us and start your creative journey today.
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && <p id="fullName-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                                placeholder="Enter your email"
                            />
                            {errors.email && <p id="fullName-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p id="fullName-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && <p id="fullName-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 animate-gradient bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </motion.button>

                        {/* <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                            className="relative my-6"
                        >
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleGoogleSignup}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 shadow-sm"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <img src={GoogleSvg} alt="Google" className="w-5 h-5 mr-2" />
                                    Sign up with Google
                                </>
                            )}
                        </motion.button> */}
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3, duration: 0.5 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200">
                                Sign in
                            </Link>
                        </p>
                    </motion.div>

                    <div className="absolute bottom-4 left-4 lg:hidden">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 180, ease: "linear", repeat: Infinity }}
                        >
                            <svg width="32" height="32" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.4627 1.54666C10.5413 0.786047 11.6527 0.78605 11.7313 1.54666C12.2249 6.3258 16.0138 10.1123 20.7965 10.5868C21.5552 10.6621 21.5552 11.768 20.7965 11.8433C16.0138 12.3177 12.2249 16.1043 11.7313 20.8834C11.6527 21.644 10.5413 21.644 10.4627 20.8834C9.96906 16.1043 6.18018 12.3177 1.39746 11.8433C0.638807 11.768 0.638817 10.6621 1.39746 10.5868C6.18018 10.1123 9.96906 6.3258 10.4627 1.54666Z"
                                    fill="#F1F3F4" stroke="black" className="dark:fill-gray-800 dark:stroke-gray-600 fill-black stroke-black" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default SignupPage;