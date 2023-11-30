import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      if (!username) {
        const { data } = axios.get("/profile").then(({ data }) => {
          setUsername(data);
          setReady(true);
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }, []);
  return (
    <UserContext.Provider value={{ username, setUsername, ready }}>
      {children}
    </UserContext.Provider>
  );
}
