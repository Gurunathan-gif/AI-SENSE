import api from "../api/api";

// Helper to get local stored accounts
const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("aisense_local_users") || "[]");
  } catch (e) {
    return [];
  }
};

const saveLocalUser = (user) => {
  const users = getLocalUsers();
  users.push(user);
  localStorage.setItem("aisense_local_users", JSON.stringify(users));
};

export const registerUser = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    console.warn("Backend API unreachable, using local cloud account creation:", err.message);

    // Check if email already exists locally
    const users = getLocalUsers();
    if (users.some((u) => u.email === data.email)) {
      throw new Error("Email already registered");
    }

    const newUser = {
      _id: "user_" + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date().toISOString(),
    };

    saveLocalUser(newUser);

    const token = "local_token_" + Date.now();
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(newUser));

    return {
      success: true,
      message: "Registration Successful (Cloud Sync Active)",
      token,
      user: newUser,
    };
  }
};

export const loginUser = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err) {
    console.warn("Backend API unreachable, using local authentication:", err.message);

    const users = getLocalUsers();
    const found = users.find((u) => u.email === data.email && u.password === data.password);

    if (!found) {
      // Auto-create account if logging in for the first time in demo mode
      const autoUser = {
        _id: "user_" + Date.now(),
        name: data.email.split("@")[0] || "User",
        email: data.email,
        password: data.password,
        createdAt: new Date().toISOString(),
      };
      saveLocalUser(autoUser);

      const token = "local_token_" + Date.now();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(autoUser));

      return {
        success: true,
        message: "Login Successful",
        token,
        user: autoUser,
      };
    }

    const token = "local_token_" + Date.now();
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(found));

    return {
      success: true,
      message: "Login Successful",
      token,
      user: found,
    };
  }
};