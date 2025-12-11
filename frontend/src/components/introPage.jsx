import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/usetheme';

export default function IntroPage({ onClose }) {
  const [stateOfIntro, setStateOfIntro] = useState('hello');
  const { theme } = useTheme();

useEffect(() => {
  const timer1 = setTimeout(() => {
    setStateOfIntro('none');
  }, 1700);
  const timer2 = setTimeout(() => {
    setStateOfIntro('friend');
  }, 2100);
  const timer3 = setTimeout(() => {
    setStateOfIntro('none');
  }, 4200);
  const timer4 = setTimeout(() => {
    onClose && onClose();
  }, 4600);
  const timer5 = setTimeout(() => {
    setStateOfIntro('hello');
  }, 7000);

  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
    clearTimeout(timer3);
    clearTimeout(timer4);
    clearTimeout(timer5);
  };
}, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <AnimatePresence>
        {stateOfIntro === 'hello' && (
          <motion.h1
            key="hello-text"
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
            className="text-5xl text-fg dark:text-fg-d"
            style={{
              textShadow: `0px 0px 40px ${
                theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(20, 0, 0, 0.1)'
              }, ${
                theme === 'dark'
                  ? '0px 0px 20px rgba(255, 255, 255, 0.6)'
                  : '0px 0px 20px rgba(0, 0, 0, 0.3)'
              }`,
            }}
          >
            سلام.
          </motion.h1>
        )}
        {stateOfIntro === 'friend' && (
          <motion.h1
            key="friend-text"
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
            className="text-5xl text-fg dark:text-fg-d"
            style={{
              textShadow: `0px 0px 40px ${
                theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(20, 0, 0, 0.1)'
              }, ${
                theme === 'dark'
                  ? '0px 0px 20px rgba(255, 255, 255, 0.6)'
                  : '0px 0px 20px rgba(0, 0, 0, 0.3)'
              }`,
            }}
          >
            دوست من
          </motion.h1>
        )}
      </AnimatePresence>
      <div className="flex justify-center"></div>
    </motion.div>
  );
}
