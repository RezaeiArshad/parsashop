import { createContext, useContext, useState, useCallback } from 'react';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [status, setStatus] = useState('inactive');

  const setStatusFromButton = useCallback((newStatus) => {
    setStatus(newStatus);
  }, []);

  const isOpen = status === 'clicked' || status === 'clickedHovered';

  return (
    <MenuContext.Provider
      value={{ status, isOpen, setStatus: setStatusFromButton }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const CategoryContext = createContext({
   category: 'ماژول',
   setCategory: () => {}
}) 

export const CategoryContextProvider = ({ children }) => {
  const [category, setCategory] = useState("ماژول");
  return (
    <CategoryContext.Provider value={{category, setCategory}}>
      {children}
    </CategoryContext.Provider>
  )
}

export const SubsetContext = createContext({
  subsetCategory: "کاهنده",
  setSubsetCategory: () => {}
})

export const SubsetContextProvider = ({ children }) => {
  const [subsetCategory, setSubsetCategory] = useState("کاهنده");
  return (
    <SubsetContext.Provider value={{subsetCategory, setSubsetCategory}}>
      { children }
    </SubsetContext.Provider>
  )
}
