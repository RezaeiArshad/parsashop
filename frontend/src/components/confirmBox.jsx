import { useContext, useEffect, useState } from 'react';
import { ConfirmBoxContext } from '../contexts/confirmBoxContext';
import { AnimatePresence, motion } from 'motion/react';

export default function ConfirmBox() {
  const { confirmBox, setConfirmBox } = useContext(ConfirmBoxContext);
  const [boxState, setBoxState] = useState("inactive");

    const closeAndResolve = (value) => {
      try {
        if (confirmBox?.resolve) confirmBox.resolve(value);
      } catch (e) {
        // ignore
      } finally {
        setConfirmBox({ isOpen: false, message: '', resolve: null });
      }
    };

  const handleConfirm = () => {
    closeAndResolve(true);
  };

  const handleCancel = () => {
    closeAndResolve(false);
  };

  useEffect(() => {
    if (!confirmBox.isOpen) {
        setConfirmBox((prev) => ({ ...prev, resolve: null, message: '' }));
    }
  }, [confirmBox.isOpen]);

return (
  <AnimatePresence>
    {confirmBox.isOpen && (
      <>
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-10 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setBoxState('triggered')}
        />
        <motion.div
          key={confirmBox.message}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={
            boxState === 'triggered'
              ? {
                  opacity: 1,
                  scale: 1.05,
                  boxShadow: '0 0 30px 10px rgba(255,0,0,0.3)',
                }
              : {
                  opacity: 1,
                  scale: 1,
                  boxShadow: '0 0 6px 2px rgba(0,0,0,0.08)',
                }
          }
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onAnimationComplete={() => setBoxState('inactive')}
          className="fixed top-1/3 left-1/2 z-30 w-fit h-fit -translate-x-1/2 rounded-md bg-bg py-3 px-5"
        >
          <p className="mb-5">{confirmBox.message}</p>
          <div className="flex gap-5 justify-between w-fit mx-auto">
            <motion.button
              onClick={handleConfirm}
              animate={{ y: 0, boxShadow: '0 0 0px 0px rgba(0,0,0,0.08)' }}
              whileHover={{ y: -2, boxShadow: '0 0 6px 2px rgba(0,0,0,0.08)' }}
              whileTap={{ y: 0, boxShadow: '0 0 0px 0px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.2 }}
              className="px-5 py-2 bg-gradient-to-br from-purple-400 to-purple-600 text-white font-semibold text-sm rounded-md hover:shadow-lg active:translate-y-0"
            >
              تایید
            </motion.button>
            <motion.button
              onClick={handleCancel}
              animate={{ y: 0, boxShadow: '0 0 0px 0px rgba(0,0,0,0.08)' }}
              whileHover={{ y: -2, boxShadow: '0 0 6px 2px rgba(0,0,0,0.08)' }}
              whileTap={{ y: 0, boxShadow: '0 0 0px 0px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.2 }}
              className="px-5 py-2 bg-white/20 font-semibold text-sm rounded-md border border-fg2"
            >
              انصراف
            </motion.button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
}
