import { createContext, useState } from 'react';

export const ConfirmBoxContext = createContext({
    confirmBox: [false, false, ''],
    setConfrimBox: () => {},
});

export const ConfirmBoxContextProvider = ({ children }) => {
    const [confirmBox, setConfirmBox] = useState([false, false, '']);
    return (
        <ConfirmBoxContext.Provider value={{ confirmBox, setConfirmBox }}>
            {children}
        </ConfirmBoxContext.Provider>
    );
}