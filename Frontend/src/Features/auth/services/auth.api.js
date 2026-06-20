import API from "./api";

// REGISTER
export const register = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const login = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// GOOGLE LOGIN
export const googleLogin = () => {
  window.location.href = "https://snitch-fwb7.onrender.com/api/auth/google";
};

// ⭐ FIXED PROFILE (NO manual headers needed if API uses interceptor)
export const getProfile = async () => {
  const res = await API.get("/auth/profile");
  return res.data;
};


// LOGOUT
export const logout = async () => {
  localStorage.removeItem("token");
  const res = await API.post("/auth/logout");
  return res.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (data) => {
  const res = await API.post("/auth/forgot-password", data);
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async (data) => {
  const res = await API.post(
    `/auth/reset-password/${data.token}`,
    { password: data.password }
  );
  return res.data;
};



// ADD ADDRESS
export const addAddressAPI = async (data) => {
  const res = await API.post("/auth/address", data);
  return res.data;
};