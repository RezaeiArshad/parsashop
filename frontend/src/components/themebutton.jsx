import { motion } from 'motion/react';

function ThemeButton() {
    return (<>
      <motion.div className='flex-center'>
        <button>dark</button> 
      </motion.div>
    </>)
}

export default ThemeButton