import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, loginUser, registerUser, logoutUser, updateUserProfile } from '../redux/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  const login = async (email, password) => {
    const res = await dispatch(loginUser({ email, password })).unwrap();
    return res.user;
  };

  const register = async (userData) => {
    const res = await dispatch(registerUser(userData)).unwrap();
    return res.user;
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const updateUser = async (data) => {
    return await dispatch(updateUserProfile(data)).unwrap();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isCharity: user?.role === 'charity',
        isDonor: user?.role === 'donor',
        isVolunteer: user?.role === 'volunteer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
