import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../auth/AuthContextProvider";

export default function Users() {
    const { loggedUser } = useAuthContext();

    if (!loggedUser) {
        return (<Navigate to="/login" />)
    }

    return (
        <>
            <Outlet />
        </>
    )
}