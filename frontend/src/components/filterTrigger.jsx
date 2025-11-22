import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PriceComma from '../hooks/pricecomma';

export default function FilterTrigger({ name }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const min = 0;
  const max = 10000000;
  const [priceRange, setPriceRange] = useState({
    min: min,
    max: max,
  });

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), priceRange.max - 100000);
    setPriceRange({ ...priceRange, min: newMin });
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), priceRange.min + 100000);
    setPriceRange({ ...priceRange, max: newMax });
  };

  const renderFilterContent = () => {
    switch (name) {
      case 'قیمت': {
        return (
          <div className="p-4 w-72">
            <h4 className="text-sm font-bold text-gray-800 mb-3 text-right">
              محدوده قیمت
            </h4>

            {/* Display current range */}
            <div className="flex justify-between text-sm mb-4 text-gray-700">
              <span>
                حداکثر: <PriceComma value={priceRange.max} />
                تومان
              </span>
              <span>
                حداقل: <PriceComma value={priceRange.min} />
                تومان
              </span>
            </div>

            {/* Slider container */}
            <div className="relative mb-6 py-2">

            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition">
              اعمال فیلتر
            </button>
          </div>
        );
      }

      case 'checkbox':
        return <div className="p-3 w-48"></div>;

      case 'color':
        return <div className="p-2 flex flex-wrap gap-1 w-32"></div>;

      default:
        return <div className="p-3 text-sm">Custom filter UI for "{name}"</div>;
    }
  };

  return (
    <motion.div
      className="relative flex items-center justify-center filter-options cursor-pointer rounded-xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={isOpen ? 'active' : 'inactive'}
      variants={{
        active: { border: '1px solid var(--high)' },
        inactive: { border: '1px solid var(--fg2)' },
      }}
      initial="inactive"
      transition={{ duration: 0.2 }}
    >
      <motion.h1
        animate={isOpen ? 'active' : 'inactive'}
        onClick={() => setIsOpen(!isOpen)}
        variants={{
          active: { opacity: 1, scale: 1.08, color: 'var(--high)' },
          inactive: { opacity: 0.8 },
          tapped: { scale: 0.98 },
        }}
        initial="inactive"
        whileTap="tapped"
        transition={{ duration: 0.2 }}
      >
        {name}
      </motion.h1>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-[70%] mt-1 z-10 bg-white border rounded shadow-lg"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {renderFilterContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
