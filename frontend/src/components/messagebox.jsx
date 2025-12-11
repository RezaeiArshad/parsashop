import {motion} from "motion/react"

export default function MessageBox(props) {
    return (
      <motion.div
        key="messageBox"
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
        className={`${
          props.isSuccess
            ? 'bg-green-500 text-green-800 border-green-500'
            : 'bg-red-400 border text-red-900 border-red-400'
        } w-fit my-5 ms-auto me-auto flex-center p-3 rounded-xl`}
      >
        {props.children}
      </motion.div>
    );
}