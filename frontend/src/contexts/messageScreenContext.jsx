// it was here that i started to make the app my own

import { createContext, useState } from 'react';

export const MessageToastContext = createContext({
  messageToastDetails: [false, false, ''],
  setMessageToastDetails: () => {},
});

export const MessageToastContextProvider = ({ children }) => {
  const [messageToastDetails, setMessageToastDetails] = useState([false, '']);
  return (
    <MessageToastContext.Provider value={{ messageToastDetails, setMessageToastDetails }}>
      {children}
    </MessageToastContext.Provider>
  );
};
