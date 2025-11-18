import { useEffect, useState } from 'react';
import { useMenu } from '../../contexts/menucontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../../utils';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { svgArr } from '../../assets/svg';


export default function HeaderMenu() {
  const { status } = useMenu();
  const menu = useMenu();
  const isOpen = status === 'clicked' || status === 'clickedHovered';
  const [isVisuallyOpen, setIsVisuallyOpen] = useState(isOpen);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisuallyOpen(true);
    }
  }, [isOpen]);

  const updateStatus = (status) => {
    menu.setStatus(status);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <motion.div
        className="h-[100vh] w-[100vw] bg-white absolute left-0 top-0"
        style={{ zIndex: isVisuallyOpen ? 3 : -3 }}
        initial={{ opacity: 0 }}
        animate={
          status === 'clicked' || status === 'clickedHovered'
            ? { opacity: 0.4 }
            : { opacity: 0 }
        }
        transition={{
          opacity: { duration: 0.2 },
        }}
        onAnimationComplete={() => {
          if (!isOpen) {
            setIsVisuallyOpen(false);
          }
        }}
        onClick={() => updateStatus('inactive')}
      ></motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={'menu'}
            className="h-fit pb-5 w-[30vw] bg-bg absolute right-0"
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
            <div className="h-[10vh]">
              <Link to={`/search`}>Search Screen</Link>
            </div>

            <div className="grid gap-4 mx-[10%] text-2xl">
              {categories.map((category) => (
                <Link
                  key={category}
                  onClick={() => updateStatus('inactive')}
                  to={`/search?category=${category}`}
                >
                  <motion.h1
                    whileHover={{ color: 'var(--high)', fill: "var(--high)" }}
                    transition={{ duration: 0.2 }}
                    className="border-b-1 border-b-fg2 pb-1 flex items-center gap-1"
                  >
                    {svgArr[category]}{category} 
                  </motion.h1>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
