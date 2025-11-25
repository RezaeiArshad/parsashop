import { useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchContext } from '../contexts/searchContext.jsx';
import { cats } from '../sections/searchscreen/categoryData.jsx';
import { toast } from 'react-toastify';
import { getError } from '../utils.jsx';


export default function FilterTrigger({ name, config, category, subset }) {
  const [isOpen, setIsOpen] = useState(false);
   //note that the first filter in the searchDetails is at index 2
  const indexOfFilterInCats = Object.keys(cats[category]).indexOf(name);

  const { searchDetails } = useContext(SearchContext);  
  const [inputValue, setInputvalue] = useState(searchDetails[indexOfFilterInCats + 2] == 'not set' ? searchDetails[indexOfFilterInCats + 2] : '');
  const timeoutRef = useRef(null);

  const setFilter = (inputValue, sentCategory, sentSubsetCategory) => {
    //here I set the filter values for the search 
    if (!inputValue) {
      toast.error('لطفا مقداری را وارد کنید');
      return 
    }
    if (sentCategory === searchDetails[0] && sentSubsetCategory === searchDetails[1]) {
      searchDetails[indexOfFilterInCats + 2] = inputValue;
      console.log(searchDetails)
    }
    else {
      searchDetails[0] = sentCategory;
      searchDetails[1] = sentSubsetCategory;
      searchDetails[indexOfFilterInCats + 2] = inputValue;
      console.log(searchDetails)
    }
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const renderFilterContent = (name, config) => {
    return (
      <div className="p-4 w-65">
        <h4 className="text-sm font-bold text-gray-800 mb-3 text-right">
          {name}
        </h4>
        <input
          className="ms-[5%] rounded-md w-[90%] border border-fg2 relative mb-6 p-2"
          placeholder={config}
          value={inputValue}
          onChange={(e) => setInputvalue(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
          onClick={() => setFilter(inputValue, category, subset)}
        >
          اعمال فیلتر
        </button>
      </div>
    );
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
            {renderFilterContent(name, config)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
