import { useEffect, useState } from 'react';
import { useMenu } from '../../contexts/menucontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../../utils';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';


export default function HeaderMenu() {
  const { status } = useMenu();
  const menu = useMenu();
  const isOpen = status === 'clicked' || status === 'clickedHovered';
  const [isVisuallyOpen, setIsVisuallyOpen] = useState(isOpen);

  const [categories, setCategories] = useState([])

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
        setCategories(data)
      } catch (err) {
        toast.error(getError(err))
      }
    }
    fetchCategories()
  }, [])

  return (
    <>
      <motion.div
        className="h-[100vh] w-[70vw] bg-white absolute right-0 top-0"
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
      <motion.div
        className="h-[100vh] w-[30vw] bg-fg2 absolute left-0"
        style={{ zIndex: isVisuallyOpen ? 3 : -3 }}
        initial={{ opacity: 0, x: -300 }}
        animate={
          status === 'clicked' || status === 'clickedHovered'
            ? { opacity: 0.95, x: 0 }
            : { opacity: 0, x: -200 }
        }
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
        {categories.map((category) => (
          <Link
            key={category}
            onClick={() => updateStatus('inactive')}
            to={`/search?category=${category}`}
          >{category}</Link>
        ))}
      </motion.div>
    </>
  );
}
