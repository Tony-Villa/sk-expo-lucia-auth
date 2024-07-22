import { createContext, ReactElement, useState } from "react";

type User = {
  id: string
  name: string
  avatarUrl: string
}

interface IUserContext {
    user: User | null | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const initialState = {
    user: null,
    setUser: () => {},
};

export const UserContext = createContext<IUserContext>(initialState);

export const UserProvider = ({children}: {children: ReactElement}) => {
    const [user, setUser] = useState(initialState.user as User | null);


    return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>
}