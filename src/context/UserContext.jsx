"use client"

import { useContext, useState, createContext } from "react"

const UserContext = createContext();

export const UserContextProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);