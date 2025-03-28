import axios from "axios";
import { ICreateUser } from "../../schemas/user.schema";
import toast from "react-hot-toast";

export const createUser = async (
  formData: ICreateUser,
  navigate: (path: string) => void
): Promise<string | undefined> => {
  try {
    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/auth/signup`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    toast.success(response.data.message);
    navigate("/login");
    return response.data;
  } catch (error: string | any) {
    console.error("Error creating user:", error);
    toast.error(error.response.data.message);
    return error.message;
  }
};
