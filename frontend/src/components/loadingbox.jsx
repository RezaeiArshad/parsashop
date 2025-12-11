import { motion } from "motion/react"

export default function LoadingBox() {
    return (
      <motion.div
        key="loadingBox"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="loader border-fg text-fg dark:text-fg-d dark:border-fg-d"></span>
      </motion.div>
    );
}