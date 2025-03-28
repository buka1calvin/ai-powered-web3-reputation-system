import axios from "axios";
import { getStoredUserData } from "../signin";

export const logoutApi = async (): Promise<any> => {
  try {
    const { sessionId } = getStoredUserData();

    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );

    localStorage.removeItem("authToken");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
