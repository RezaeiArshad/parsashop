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
import { MessageToastContextProvider } from './contexts/messageScreenContext.jsx';

createRoot(document.getElementById('root')).render(
  <MessageToastContextProvider>
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
  </MessageToastContextProvider>
);
