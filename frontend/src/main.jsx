import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { StoreProvider } from './store.jsx';
import {
  CategoryContextProvider,
  MenuProvider,
  SubsetContextProvider,
} from './contexts/menucontext.jsx';
import { SearchContextProvider } from './contexts/searchContext.jsx'; 

createRoot(document.getElementById('root')).render(
  <SearchContextProvider>
  <SubsetContextProvider>
    <CategoryContextProvider>
      <MenuProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </MenuProvider>
    </CategoryContextProvider>
  </SubsetContextProvider>    
  </SearchContextProvider>

);
