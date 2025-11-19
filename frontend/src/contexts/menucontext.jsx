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

export const FilterContext = createContext({
   filtersFor: 'ماژول',
   setFiltersFor: () => {}
}) 

export const FilterContextProvider = ({ children }) => {
  const [filtersFor, setFiltersFor] = useState("ماژول");
  return (
    <FilterContext.Provider value={{filtersFor, setFiltersFor}}>
      {children}
    </FilterContext.Provider>
  )
}
