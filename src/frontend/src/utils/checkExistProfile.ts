import { getProfile } from "../api/profiles";

export const checkExitsProfile = async (): Promise<boolean> => {
  try {
    const profile = await getProfile();
    if (profile) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
