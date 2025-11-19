import { useContext, useEffect, useState } from 'react';
import { FilterContext, useMenu } from '../../contexts/menucontext';
import { AnimatePresence, motion } from 'motion/react';

export default function FilterTree() {
  const { filtersFor } = useContext(FilterContext);
  const { status } = useMenu();
  const menu = useMenu();
  const isOpen = status === 'clicked' || status === 'clickedHovered';
  const [isVisuallyOpen, setIsVisuallyOpen] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisuallyOpen(true);
    }
  }, [isOpen]);

  const updateStatus = (status) => {
    menu.setStatus(status);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{ zIndex: isVisuallyOpen ? 4 : -3 }}
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 0.98, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{
              x: { type: 'spring', damping: 25, stiffness: 200 },
              opacity: { duration: 0.2 },
            }}
            onAnimationComplete={() => {
              if (!isOpen) {
                setIsVisuallyOpen(false);
              }
            }}
            className="absolute bg-bg w-[40vw] h-[40vh] top-[15vh] right-[25vw] p-4"
          >
            <h1 className='text-2xl'>فیلتر ها</h1>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
