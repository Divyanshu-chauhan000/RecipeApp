import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type User = {
  fullName?: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: any, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    const userToken = await SecureStore.getItemAsync("userToken");
    const userData = await SecureStore.getItemAsync("userData");
    if (userToken) {
      setToken(userToken);
    }
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  };

  const login = async (userData: any, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    await SecureStore.setItemAsync("userToken", String(authToken));
    await SecureStore.setItemAsync("userData", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync("userToken");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
