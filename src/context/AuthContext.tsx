import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  updateProfile as updateProfileAPI,
} from "@/services/api";

import {
  getToken,
  removeToken,
  removeUser,
  saveToken,
  saveUser,
} from "@/services/authStorage";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  setSession: (
    token: string,
    user: User
  ) => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const restoreSession = async () => {
    try {
      const savedToken = await getToken();

      if (!savedToken) {
        return;
      }

      // Verify token with backend
      const verifiedUser = await getCurrentUser();

      setToken(savedToken);
      setUser(verifiedUser);

    } catch (error) {
      console.error("Session validation failed:", error);

      await removeToken();
      await removeUser();

      setToken(null);
      setUser(null);

    } finally {
      setLoading(false);
    }
  };

  restoreSession();
}, []);


    const setSession = async (
    newToken: string,
    newUser: User
    ) => {
    await saveToken(newToken);
    await saveUser(newUser);

    setToken(newToken);
    setUser(newUser);
    };

  const logout = async () => {
    await removeToken();
  await removeUser();

  setToken(null);
  setUser(null);
  };

  const updateProfile = async (name: string, email: string) => {
  const updatedUser = await updateProfileAPI(name, email);

  await saveUser(updatedUser);

  setUser(updatedUser);
};

  return (
    <AuthContext.Provider
      value={{ user,
    token,
    loading,
    logout,
    setSession,
  updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}