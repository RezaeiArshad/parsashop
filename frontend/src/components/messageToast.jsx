import { useContext, useEffect, useRef, useState } from 'react';
import { MessageToastContext } from '../contexts/messageScreenContext';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react';

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
      setMessageToastDetails([false, '']);
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

  const activate = () => {
    setMessageToastDetails([true, '']);
  };

  const close = () => {
    setMessageToastDetails([false, '']);
  };

  const width = useTransform(remainingMotion, [0, 5000], ['0%', '100%']);

  return (
    <>
      <AnimatePresence>
        {messageToastDetails[0] ? (
          <motion.div
            key={messageToastDetails[1] || 'toast'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed bottom-0 w-[100vw] bg-high h-[10vh]"
          >
            <motion.div className="w-40">
              <motion.div
                className="bg-red-800 h-3"
                style={{ width }}
              ></motion.div>
              <motion.div> the message {messageToastDetails[1]}</motion.div>
              <button onClick={close}>close</button>
              <motion.div
                className="bg-red-800 h-3"
                style={{ width }}
              ></motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <>
            <button onClick={activate}>active error</button>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
