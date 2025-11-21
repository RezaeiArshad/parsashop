import { useContext } from "react";
import { Store } from "../store";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const { state } = useContext(Store);
    const {userInfo} = state;
  return (
    <>
      {userInfo  && userInfo.isAdmin ? children : <Navigate to="/signin" />}
    </>
  );
}
