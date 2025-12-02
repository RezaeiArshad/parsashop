import { useContext, useEffect, useState } from 'react';
import {
  CategoryContext,
  SubsetContext,
  useMenu,
} from '../../contexts/menucontext';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { svgArr } from '../../assets/svg';
import FilterTree from '../searchscreen/filterTree';
import { cats, subsets } from '../searchscreen/categoryData';

export default function HeaderMenu() {
  const { status } = useMenu();
  const menu = useMenu();
  const isOpen = status === 'clicked' || status === 'clickedHovered';
  const [isVisuallyOpen, setIsVisuallyOpen] = useState(isOpen);
  const { category, setCategory } = useContext(CategoryContext);
  const { setSubsetCategory } = useContext(SubsetContext);

  useEffect(() => {
    if (isOpen) {
      setIsVisuallyOpen(true);
    }
  }, [isOpen]);

  const updateStatus = (status) => {
    menu.setStatus(status);
  };

  const menuClosed = () => {
    setCategory('ماژول');
    setSubsetCategory('کاهنده');
    updateStatus('inactive');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key='background-black-div'
              className="h-[100vh] w-[100vw] bg-black absolute left-0 top-0"
              initial={{ opacity: 0 }}
              animate={
                status === 'clicked' || status === 'clickedHovered'
                  ? { opacity: 0.2 }
                  : { opacity: 0 }
              }
              exit={{opacity: 0}}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => {
                if (!isOpen) {
                  setIsVisuallyOpen(false);
                }
              }}
              onClick={() => menuClosed()}
            ></motion.div>
            <motion.div
              key={'menu'}
              className="h-fit pb-5 lg:w-[25vw] md:w-[20vw] bg-bg absolute right-0 rounded-b-md"
              style={{ zIndex: isVisuallyOpen ? 4 : -3 }}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 0.98, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{
                x: { type: 'spring', damping: 25, stiffness: 200 },
                opacity: { duration: 0.2 },
              }}
              onAnimationComplete={() => {
                if (!isOpen) {
                  setIsVisuallyOpen(false);
                }
              }}
            >
              <div className="h-[10vh] lg:ms-[12vw] md:ms-[7vw] pt-[2vh]">
                <h1 className="text-2xl">دسته بندی ها</h1>
              </div>
              <div className="grid gap-4 mx-[10%] text-xl">
                {Object.keys(cats).map((categoryName) => (
                  <Link
                    key={categoryName}
                    onClick={() => menuClosed()}
                    to={`/search?categoryName=${categoryName}`}
                  >
                    <motion.h1
                      initial="inactive"
                      animate={
                        category === categoryName ? 'active' : 'inactive'
                      }
                      whileHover="active"
                      transition={{ duration: 0.2 }}
                      className="border-b-1 border-b-fg2 p-1 flex items-center gap-2"
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
                      onHoverStart={() => {
                        setSubsetCategory(subsets[categoryName][0]);
                        setCategory(categoryName);
                      }}
                    >
                      {svgArr[categoryName]}
                      {categoryName}
                    </motion.h1>
                  </Link>
                ))}
              </div>
            </motion.div>
            <FilterTree />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
