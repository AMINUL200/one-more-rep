import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🔐 State management with dummy data
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 DUMMY DATA - Replace with your actual data
  const dummyUser = {
    id: "user_001",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    avatar: "https://via.placeholder.com/150",
  };

  const dummyToken = "dummy_jwt_token_xyz123";

  // 🔐 Restore auth on refresh (using dummy data for simulation)
  useEffect(() => {
    // Simulate API call/check
    setTimeout(() => {
      // Check if user wants to use dummy data (remove this in production)
      const useDummy = true; // Set to false to disable dummy data

      if (useDummy) {
        // For testing: Auto-login with dummy data
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } else {
          // Use dummy data if nothing in localStorage
          // setUser(dummyUser);
          // setToken(dummyToken);
          // Uncomment above lines for auto-dummy login
        }
      }

      setLoading(false);
    }, 1000); // 1 second delay to simulate network request
  }, []);

  // 🔐 DUMMY LOGIN FUNCTION
  const login = async (credentials = {}) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // DUMMY VALIDATION - Replace with actual API call
    const { email = "test@example.com", password = "password123" } =
      credentials;

    if (email && password) {
      // Success - Set user and token
      const userData = {
        ...dummyUser,
        email: email,
        name: email.split("@")[0], // Extract name from email
      };

      setUser(userData);
      setToken(dummyToken);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", dummyToken);

      setLoading(false);
      return { success: true, data: userData };
    } else {
      // Failure
      setLoading(false);
      throw new Error("Invalid credentials");
    }
  };

  // 🔐 DUMMY LOGOUT FUNCTION
  const logout = () => {
    // Simulate API call delay
    setTimeout(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Optional: Redirect after logout
      // window.location.href = "/login";
    }, 500);
  };

  // 🔐 DUMMY REGISTER FUNCTION (Optional)
  const register = async (userData) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // DUMMY REGISTRATION LOGIC
    const newUser = {
      ...dummyUser,
      ...userData,
      id: `user_${Date.now()}`,
    };

    setUser(newUser);
    setToken(dummyToken);

    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", dummyToken);

    setLoading(false);
    return { success: true, data: newUser };
  };

  // 🔐 DUMMY UPDATE PROFILE FUNCTION (Optional)
  const updateProfile = async (updatedData) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setLoading(false);
    return { success: true, data: updatedUser };
  };

  // 🔐 FOR DEVELOPMENT: Quick login/logout functions
  const quickLogin = () => {
    setUser(dummyUser);
    setToken(dummyToken);
    localStorage.setItem("user", JSON.stringify(dummyUser));
    localStorage.setItem("token", dummyToken);
  };

  const quickLogout = () => {
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        // State
        user,
        token,
        loading,

        // Core Functions
        login,
        logout,
        register,
        updateProfile,

        // Helper Functions
        quickLogin, // For development only
        quickLogout, // For development only

        // Computed Properties
        isAuthenticated: !loading && !!token,
        isAdmin: user?.role === "admin",
        isUser: user?.role === "user",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// 🔐 Additional hook for auth status
export const useAuthStatus = () => {
  const { isAuthenticated, loading } = useAuth();
  return { isAuthenticated, loading };
};

// 🔐 Hook for protected routes
export const withAuth = (Component) => {
  return function ProtectedComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>; // Or your custom loader
    }

    if (!isAuthenticated) {
      // Redirect to login or show unauthorized
      window.location.href = "/login";
      return null;
    }

    return <Component {...props} />;
  };
};
