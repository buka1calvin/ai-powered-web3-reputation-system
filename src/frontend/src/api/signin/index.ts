import axios from "axios";
import toast from "react-hot-toast";
import { ISignIn } from "../../schemas/user.schema";
import { UserRole } from "@/src/backend/types/types";

interface LoginResponse {
  userId: string;
  email: string;
  password: string;
  role: UserRole;
  sessionId: string;
  firstName: string;
  lastName: string;
  phone: string;
  message: string;
}



export const loginUser = async (
  formData: ISignIn
): Promise<LoginResponse | any> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/auth/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { data } = response;

    const tokenData = btoa(
      JSON.stringify({
        sessionId: data.sessionId,
        userId: data.userId,
        role: data.role,
        timestamp: new Date().getTime(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      })
    );

    localStorage.setItem("authToken", tokenData);
    toast.success(data.message || "Login successful");

    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    toast.error(errorMessage);
    return error;
  }
};

export const getStoredUserData = () => {
  const tokenData = localStorage.getItem("authToken");
  if (!tokenData) return null;

  try {
    return JSON.parse(atob(tokenData));
  } catch (error) {
    return error;
  }
};
