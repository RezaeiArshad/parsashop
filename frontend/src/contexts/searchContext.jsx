import { useState, createContext} from 'react'

// this is what the array should contain [categroy, subset, filter1, filter2, filter3, filter4, filter5]
// and if a filter is not set it has to be set to 'notSet'
export const SearchContext = createContext({
  searchDetails: [
    'ماژول',
    'کاهنده',
    'notSet',
    'notSet',
    'notSet',
    'notSet',
    'notSet',
  ],
  setSearchDetails: () => {},
});

export const SearchContextProvider = ({ children }) => {
  const [searchDetails, setSearchDetails] = useState([
    'ماژول',
    'کاهنده',
    'notSet',
    'notSet',
    'notSet',
    'notSet',
    'notSet',
  ]);

  return (
    <SearchContext.Provider value={{ searchDetails, setSearchDetails }}>
      {children}
    </SearchContext.Provider>
  );
};
