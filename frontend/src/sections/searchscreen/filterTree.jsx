import { useContext, useEffect, useState } from 'react';
import { CategoryContext, SubsetContext, useMenu } from '../../contexts/menucontext';
import { AnimatePresence, motion } from 'motion/react';
import { cats, subsets } from './categoryData';
import FilterTrigger from '../../components/filterTrigger';

export default function FilterTree() {
  const { status } = useMenu();
  const isOpen = status === 'clicked' || status === 'clickedHovered';
  const [isVisuallyOpen, setIsVisuallyOpen] = useState(isOpen);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const {subsetCategory, setSubsetCategory} = useContext(SubsetContext);
  const { category } = useContext(CategoryContext);

  useEffect(() => {
    if (isOpen) {
      setIsVisuallyOpen(true);
    }
  }, [isOpen]);

  const search = () => {

  }

  useEffect(() => {
    setCategoryFilters(cats[category]);
  }, [category]);

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
              {subsets[category].map((subset) => (
                <motion.h1
                  initial="inactive"
                  animate={subsetCategory === subset ? 'active' : 'inactive'}
                  whileHover="active"
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer border-b-1 border-b-fg2 p-1 flex items-center gap-2 h-7"
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
                  onHoverStart={() => setSubsetCategory(subset)}
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
              <h1 className="text-2xl h-[15%]">
                <span className="text-fg2">فیلتر ها برای</span> {category}/
                {subsetCategory}
              </h1>
              <div className="flex h-[80%]">
                <div className="h-[100%] w-[30%] flex flex-col justify-around items-center gap-2">
                  {Object.keys(categoryFilters)
                    .slice(0, 3)
                    .map((filter) => (
                      <FilterTrigger
                        key={filter}
                        // these are for setting the pop up window for the filter
                        name={filter}
                        config={categoryFilters[filter]}
                        // these are for comparing to set the filter
                        category={category}
                        subset={subsetCategory}
                      />
                    ))}
                </div>
                <div className="h-[70%] my-auto w-[30%] flex flex-col justify-around items-center gap-2">
                  {Object.keys(categoryFilters)
                    .slice(3, 5)
                    .map((filter) => (
                      <FilterTrigger
                        key={filter}
                        name={filter}
                        config={categoryFilters[filter]}
                        // these are for comparing to set the filter
                        category={category}
                        subset={subsetCategory}
                      />
                    ))}
                </div>
                <button
                  className="w-[30%] h-fit my-auto bg-high p-3 rounded-xl text-fg-d hover:bg-yellow-400 transition-colors duration-300 cursor-pointer"
                  onClick={search()}
                >
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
