import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './sections/header/header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MessageToast from './components/messageToast';
import IntroPage from './components/introPage';
import LoadingBox from './components/loadingbox';
import ConfirmBox from './components/confirmBox';
import { useTheme } from './hooks/usetheme';
import { usePageTitle } from './hooks/usepagetitle';
import { AnimatePresence, motion } from 'motion/react';
import AnimatedRoutes from './animateRoutes';

function App() {
  const { theme } = useTheme();

  const [loadingApp, setLoadingApp] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  usePageTitle('Spiky Tech');

  useEffect(() => {
    const seen = localStorage.getItem('seenIntro') === 'true';
    const t = setTimeout(() => {
      setLoadingApp(false);
      if (!seen) setShowIntro(true);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  const handleCloseIntro = () => {
    try {
      localStorage.setItem('seenIntro', 'true');
    } catch {
      // ignored this one as well
    }
    setShowIntro(false);
  };

  return (
    <div className="theme-div overflow-x-hidden" dir="rtl">
      <link
        href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <AnimatePresence mode="wait">
        {loadingApp ? (
          <motion.div
            key="loading"
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
            className="min-h-screen flex-center justify-center dark:bg-bg-d bg-bg translate-x-[22px]"
          >
            <LoadingBox />
          </motion.div>
        ) : showIntro ? (
          <IntroPage key="intro" onClose={handleCloseIntro} />
        ) : (
          <motion.div
            key="app"
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
            className="text-fg bg-bg dark:bg-bg-d dark:text-fg-d relative pb-15 transition-colors duration-300 pt-[10vh]"
          >
            <BrowserRouter>
              <ToastContainer position="bottom-center" limit={1} />
              <div>
                <AnimatedRoutes />
              </div>
              <Header />
              <ConfirmBox />
              <MessageToast />
            </BrowserRouter>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;