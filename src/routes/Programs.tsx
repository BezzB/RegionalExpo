import { motion } from 'framer-motion'

export default function Programs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8">Our Programs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Program items will be added here */}
      </div>
    </motion.div>
  )
}
