import { useContext, useEffect, useRef, useState } from 'react';
import { MessageToastContext } from '../contexts/messageScreenContext';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { closeSvg, errorSvg, successSvg } from '../assets/svg';

export default function MessageToast() {
  const { messageToastDetails, setMessageToastDetails } =
    useContext(MessageToastContext);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);
  const pauseTimeRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const remainingMotion = useMotionValue(5000);

  const getRemainingTime = () => {
    if (!startTimeRef.current) return 5000;
    let now = Date.now();
    let effectiveStartTime = startTimeRef.current;
    if (pauseTimeRef.current) {
      const pausedDuration = now - pauseTimeRef.current;
      effectiveStartTime += pausedDuration;
    }
    const elapsed = now - effectiveStartTime;
    return Math.max(0, 5000 - elapsed);
  };

  const delayedHideMessage = () => {
    setIsExiting(true);
    remainingMotion.set(0);
    setTimeout(() => {
      if (messageToastDetails[1]) {
        setMessageToastDetails([false, true, '']);
      } else {
        setMessageToastDetails([false, false, '']);
      }
      startTimeRef.current = null;
      pauseTimeRef.current = null;
      setIsExiting(false);
    }, 300);
  };

  const scheduleHide = (delayMs) => {
    clearTimer();
    timeoutRef.current = setTimeout(delayedHideMessage, delayMs);
  };

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (!messageToastDetails[0]) {
      clearTimer();
      startTimeRef.current = null;
      pauseTimeRef.current = null;
      setIsExiting(false);
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      scheduleHide(5000);
    } else if (isHovered) {
      if (!pauseTimeRef.current) {
        pauseTimeRef.current = Date.now();
        clearTimer();
      }
    } else {
      if (pauseTimeRef.current) {
        const pausedDuration = Date.now() - pauseTimeRef.current;
        startTimeRef.current += pausedDuration;
        pauseTimeRef.current = null;
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, 5000 - elapsed);
        scheduleHide(remaining);
      }
    }

    return () => clearTimer();
  }, [messageToastDetails[0], isHovered]);

  useEffect(() => {
    if (!messageToastDetails[0] || isExiting) return;

    const interval = setInterval(() => {
      const remaining = getRemainingTime();
      remainingMotion.set(remaining);
      if (remaining <= 0 && !isHovered) {
        delayedHideMessage();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [messageToastDetails[0], isHovered, isExiting]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const close = () => {
    if (messageToastDetails[1]) {
      setMessageToastDetails([false, true, '']);
    } else {
      setMessageToastDetails([false, false, '']);
    }
  };

  const width = useTransform(remainingMotion, [0, 5000], ['0%', '100%']);
  const gradient = useTransform(remainingMotion, [0, 5000], [-60, 40]);
  const backgroundGradient = useMotionTemplate`linear-gradient(0deg, ${
    messageToastDetails[1] ? 'limegreen' : 'red'
  } ${gradient}%, transparent)`;

  return (
    <>
      <AnimatePresence>
        {messageToastDetails[0] && (
          <motion.div
            key={messageToastDetails[1] || 'toast'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: backgroundGradient }}
            className="fixed bottom-0 w-screen h-[13vh] z-30"
          >
            <motion.div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3 }}
              className="w-80 rounded-b-xl overflow-hidden rounded-t-md absolute bottom-[12vh] left-1/2 -translate-x-1/2 min-h-27 h-fit"
              style={{
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 0 6px rgba(0,0,0,0.08)',
              }}
            >
              <motion.button
                initial={{ fill: 'var(--fg2)', scale: 1 }}
                whileHover={{ fill: 'var(--fg)', scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="w-1.8 h-1.8 block mt-2 mr-2"
                onClick={close}
              >
                {closeSvg}
              </motion.button>
              <div className="flex justify-between gap-2 w-[90%] mx-[5%] mb-2">
                <h1 className="font-medium pt-1">{messageToastDetails[2]}</h1>
                <h1 className="h-fit">
                  {messageToastDetails[1] ? successSvg : errorSvg}
                </h1>
              </div>
              <motion.div
                className={`${
                  messageToastDetails[1] ? 'bg-green-400' : 'bg-red-500'
                } h-2 absolute bottom-0`}
                style={{ width }}
              ></motion.div>
            </motion.div>
          </motion.div>
        )
        }
      </AnimatePresence>
    </>
  );
}
