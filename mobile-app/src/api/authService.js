import apiClient from "./client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("user");
  },

  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem("userToken");
    return !!token;
  },
};