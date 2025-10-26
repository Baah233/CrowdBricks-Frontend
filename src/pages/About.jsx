import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-6 md:px-20 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-600 dark:text-blue-400">
          About CrowdBricks
        </h1>
        <p className="text-lg md:text-xl leading-relaxed mb-12 text-gray-600 dark:text-gray-300">
          Building Dreams, One Brick at a Time
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-16">
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Who We Are
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            At <strong>CrowdBricks</strong>, we believe great ideas deserve the
            chance to become reality. Our platform empowers individuals,
            communities, and organizations to bring their visions to life
            through the collective power of people and resources. Whether it’s a
            startup, a community development project, or a social innovation,
            CrowdBricks provides the foundation where dreamers meet supporters,
            and projects find purpose.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            To democratize access to funding, collaboration, and innovation by
            connecting passionate project creators with the communities and
            contributors who believe in their vision.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Our Vision
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            A world where every idea — no matter how small or where it comes
            from — can find the support it needs to grow, impact lives, and
            shape the future.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            What We Do
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <strong>Empower Creators:</strong> We give innovators and
              change-makers the tools to share their projects with the world.
            </li>
            <li>
              <strong>Connect Communities:</strong> We bridge the gap between
              people with ideas and those who want to make an impact.
            </li>
            <li>
              <strong>Simplify Fundraising:</strong> We make it easy to discover,
              fund, and track meaningful projects.
            </li>
            <li>
              <strong>Ensure Transparency:</strong> Every project is backed by
              accountability tools that show how contributions are used.
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            Our Core Values
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <strong>Integrity:</strong> We build trust through honesty and
              transparency.
            </li>
            <li>
              <strong>Innovation:</strong> We constantly improve our platform to
              deliver simplicity and power.
            </li>
            <li>
              <strong>Collaboration:</strong> We believe that collective effort
              builds stronger communities.
            </li>
            <li>
              <strong>Impact:</strong> Every feature and campaign we create aims
              to make a real difference.
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-blue-600 dark:bg-blue-700 text-white p-10 rounded-2xl shadow-lg text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Why CrowdBricks?</h2>
          <p className="text-lg leading-relaxed">
            Because we’re more than a platform — we’re a movement. We’re helping
            build a culture where ideas turn into action, youth lead change, and
            communities grow stronger together.
          </p>
          <p className="mt-4 font-semibold">
            Join us as we shape the future — one project, one dream, one brick
            at a time.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
