"use client";

import { useContext, useState, useEffect, createContext } from "react";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Recuperar el usuario almacenado en sessionStorage al cargar la app
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Guardar en sessionStorage cuando el usuario cambia
    const saveUser = (userData) => {
        sessionStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // Eliminar usuario al cerrar sesión
    const logout = () => {
        sessionStorage.removeItem("user");
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, saveUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);