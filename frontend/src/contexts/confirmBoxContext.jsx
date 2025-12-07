import { createContext, useState } from 'react';

export const ConfirmBoxContext = createContext({
    confirmBox: {isOpen: false, message: 'آیا از انجام این عملیات مطمئن هستید؟', resolve: null},
    setConfirmBox: () => {},
});

export const ConfirmBoxContextProvider = ({ children }) => {
    const [confirmBox, setConfirmBox] = useState({isOpen: false, message: 'آیا از انجام این عملیات مطمئن هستید؟', resolve: null});
    return (
        <ConfirmBoxContext.Provider value={{ confirmBox, setConfirmBox }}>
            {children}
        </ConfirmBoxContext.Provider>
    );
}