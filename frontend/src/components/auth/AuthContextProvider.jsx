import { createContext, useCallback, useContext, useMemo, useState } from "react";

const LOGGED_USER = 'loggedUser';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [loggedUser, setLoggedUser] = useState(JSON.parse(window.localStorage.getItem(LOGGED_USER)) ?? null);

    const login = useCallback((user) => {
        window.localStorage.setItem(LOGGED_USER, JSON.stringify(user));
        setLoggedUser(user);
    }, []);

    const logout = useCallback(() => {
        window.localStorage.removeItem(LOGGED_USER);
        setLoggedUser(null);
    }, []);

    const contextValue = useMemo(() => ({
        login,
        logout,
        loggedUser
    }), [login, logout, loggedUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}