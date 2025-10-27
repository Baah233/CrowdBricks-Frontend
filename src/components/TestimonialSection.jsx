import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "CrowdBricks made real estate investing so simple. I started small, but now I own shares in 3 different properties!",
    name: "Judith Black",
    role: "Investor",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    quote:
      "Thanks to CrowdBricks, my development project was fully funded within weeks — incredible platform!",
    name: "Kwame Boateng",
    role: "Real Estate Developer",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    quote:
      "I love how transparent and easy it is to track my investments in real-time. Highly recommend CrowdBricks.",
    name: "Ama Serwaa",
    role: "Entrepreneur",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

const TestimonialSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      {/* background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-500),transparent)] opacity-10"></div>
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900 shadow-xl ring-1 shadow-indigo-500/5 ring-white/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>

      <div className="mx-auto max-w-2xl lg:max-w-4xl text-center">
        <img
          src="/logo.svg"
          alt="CrowdBricks logo"
          className="mx-auto h-12 mb-10"
        />

        <AnimatePresence mode="wait">
          <motion.figure
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <blockquote className="text-xl sm:text-2xl font-semibold text-white">
              <p>“{testimonials[current].quote}”</p>
            </blockquote>
            <figcaption className="mt-10">
              <img
                src={testimonials[current].image}
                alt={testimonials[current].name}
                className="mx-auto size-12 rounded-full object-cover border-2 border-yellow-400"
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-white">
                  {testimonials[current].name}
                </div>
                <svg
                  viewBox="0 0 2 2"
                  width="3"
                  height="3"
                  aria-hidden="true"
                  className="fill-white"
                >
                  <circle r="1" cx="1" cy="1" />
                </svg>
                <div className="text-gray-400">
                  {testimonials[current].role}
                </div>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        {/* dots indicator */}
        <div className="flex justify-center mt-10 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index
                  ? "bg-yellow-400 w-5"
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
