import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '../../hooks/usetheme';
import { useState } from 'react';

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  const [buttonStatus, setButtonStatus] = useState('inactive');

  return (
    <>
      <motion.div className="flex-center">
        <motion.button
          animate={buttonStatus}
          initial={'inactive'}
          variants={{ inactive: { scale: 1 }, hovered: { scale: 1.2 } }}
          whileHover={{ cursor: 'pointer' }}
          onMouseEnter={() => setButtonStatus('hovered')}
          onMouseLeave={() => setButtonStatus('inactive')}
          onClick={toggleTheme}
        >
          <AnimatePresence mode="wait">
            {theme === 'light' ? (
              <motion.svg
                key="sun"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1, transition: { duration: 0.25 } }}
                exit={{ rotate: 180, opacity: 0, transition: { duration: 0.2 } }}
                style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="w-6 h-6 text-fg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </motion.svg>
            ) : (
              <motion.svg
                key="moon"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1, transition: { duration: 0.25 } }}
                exit={{ rotate: 180, opacity: 0, transition: { duration: 0.2 } }}
                style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="w-6 h-6 text-fg-d"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </>
  );
}

export default ThemeButton;
