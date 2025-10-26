import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center p-6"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-8xl font-extrabold text-indigo-600 drop-shadow-lg"
        >
          404
        </motion.h1>

        <p className="mt-4 text-2xl font-semibold text-gray-700">
          Oops! Page not found 
        </p>
        <p className="mt-2 text-gray-500">
          The page <span className="font-medium">{location.pathname}</span> doesn’t exist or was moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-indigo-500/50"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
