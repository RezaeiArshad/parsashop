import { motion } from 'motion/react';
import { useTheme } from '../../hooks/usetheme';

function ThemeButton() {

  const { theme, toggleTheme } = useTheme()

    return (
      <>
        <motion.div className="flex-center">
          <motion.button
            whileHover={{ cursor: 'pointer' }}
            onClick={toggleTheme}
          >
            {theme === 'light' ? 'Light' : 'Dark'}
          </motion.button>
        </motion.div>
      </>
    );
}

export default ThemeButton;