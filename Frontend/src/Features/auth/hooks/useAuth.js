import { useDispatch } from "react-redux";
import { setUser, setToken, setLoading, setError } from "../redux/auth.slice";
import {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  addAddressAPI,
} from "../services/auth.api";

export const useAuth = () => {
  const dispatch = useDispatch();

  // REGISTER
  const handleRegister = async (fullName, email, contact, password, role) => {
    try {
      dispatch(setLoading(true));

      const res = await register({
        fullName,
        email,
        contact,
        password,
        role,
      });

      dispatch(setUser(res.user));
      dispatch(setToken(res.token));

      localStorage.setItem("token", res.token);

      dispatch(setLoading(false));
      return res;
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setError("Registration failed"));
      return null;
    }
  };

  // LOGIN
  const handleLogin = async (email, password) => {
    try {
      dispatch(setLoading(true));

      const res = await login({ email, password });

      console.log("FULL RESPONSE:", res);
      console.log("TOKEN:", res.token);
      console.log("USER:", res.user);

      dispatch(setUser(res.user));
      dispatch(setToken(res.token));

      localStorage.setItem("token", res.token);

      dispatch(setLoading(false));
      return res;
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setError("Invalid credentials"));
      return null;
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = () => {
    googleLogin();
  };

  const handleForgotPassword = async (email) => {
    return await forgotPassword({ email });
  };

  const handleResetPassword = async (token, password) => {
    return await resetPassword({ token, password });
  };


const handleAddAddress = async (address) => {
  try {
    dispatch(setLoading(true));

    const res = await addAddressAPI(address);

    dispatch(setUser(res.user));

    dispatch(setLoading(false));

    return res; // IMPORTANT
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError("Failed to save address"));
    return null;
  }
};
  return {
    handleRegister,
    handleLogin,
    handleGoogleLogin,
    handleForgotPassword,
    handleResetPassword,
    handleAddAddress,
  };
};