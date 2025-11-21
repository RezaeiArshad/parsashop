import { useContext, useEffect, useState } from 'react';
import { FilterContext, useMenu } from '../../contexts/menucontext';
import { AnimatePresence, motion } from 'motion/react';
import { cats, subsets } from './categoryData';
import FilterTrigger from '../../components/filterTrigger';

export default function FilterTree() {
  const { filtersFor } = useContext(FilterContext);
  const { status } = useMenu();
  const menu = useMenu();
  const isOpen = status === 'clicked' || status === 'clickedHovered';
  const [isVisuallyOpen, setIsVisuallyOpen] = useState(isOpen);
  const [categoryFilters, setCategoryFilters] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisuallyOpen(true);
    }
  }, [isOpen]);

  const updateStatus = (status) => {
    menu.setStatus(status);
  };

  useEffect(() => {
    setCategoryFilters(cats[filtersFor]);
  }, [filtersFor]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              style={{ zIndex: isVisuallyOpen ? 4 : -3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.98 }}
              exit={{ opacity: 0 }}
              transition={{
                x: { type: 'spring', damping: 25, stiffness: 200 },
                opacity: { duration: 0.2 },
              }}
              onAnimationComplete={() => {
                if (!isOpen) {
                  setIsVisuallyOpen(false);
                }
              }}
              className="absolute bg-bg w-[20vw] h-[55vh] top-[10vh] right-[25vw] p-4 rounded-e-md overflow-y-scroll flex flex-col gap-2"
            >
              {subsets[filtersFor].map((subset) => (
                <motion.h1
                  initial="inactive"
                  animate={'inactive'}
                  whileHover="active"
                  transition={{ duration: 0.2 }}
                  className="border-b-1 border-b-fg2 p-1 flex items-center gap-2 h-7"
                  variants={{
                    active: {
                      color: 'var(--high)',
                      fill: 'var(--high)',
                      background: 'var(--bg)',
                    },
                    inactive: {
                      background: '#f0f0f0',
                    },
                  }}
                  key={subset}
                >
                  {subset}
                </motion.h1>
              ))}
            </motion.div>
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
              className="absolute bg-bg w-[40vw] h-[40vh] top-[15vh] right-[45vw] p-4 rounded-e-md"
            >
              <h1 className="text-2xl h-[15%]">فیلتر ها</h1>
              <div className="flex h-[80%]">
                <div className="h-[100%] w-[30%] flex flex-col justify-around items-center">
                  {categoryFilters.slice(0, 3).map((filter) => (
                    <FilterTrigger key={filter} name={filter} />
                  ))}
                </div>
                <div className="h-[70%] my-auto bg-red-500 w-[30%] flex flex-col justify-around items-center">
                  {categoryFilters.slice(3, 5).map((filter) => (
                    <h1 key={filter}>{filter}</h1>
                  ))}
                </div>
                <button className="w-[30%] h-fit my-auto">
                  موارد پیدا شده
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
