import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { StoreProvider } from './store.jsx';
import {
  FilterContextProvider,
  MenuProvider,
} from './contexts/menucontext.jsx';

createRoot(document.getElementById('root')).render(
  <FilterContextProvider>
    <MenuProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </MenuProvider>
  </FilterContextProvider>
);
