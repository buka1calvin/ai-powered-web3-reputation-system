import React from "react";
import axios from "axios";
import { getStoredUserData } from "../signin";
import toast from "react-hot-toast";

import { uploadToCloudinary } from "../../utils/uploadImg";

export const createProfile = async (data: any): Promise<any> => {
  try {
    const { sessionId } = getStoredUserData();
    let profilePicUrl: string | null = null;
    let coverPicUrl: string | null = null;

    if (data.profilePic instanceof File) {
      profilePicUrl = await uploadToCloudinary(data.profilePic, "profile_pics");
    }

    if (data.coverPic instanceof File) {
      coverPicUrl = await uploadToCloudinary(data.coverPic, "cover_pics");
    }
    const finalData = {
      ...data,
      profilePic: profilePicUrl,
      coverPic: coverPicUrl,
    };
    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/profile/create`,
      finalData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
    return error;
  }
};

export const getProfiles = async (): Promise<any> => {
  try {
    const { sessionId } = getStoredUserData();

    const response = await axios.get(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/profiles`,
      {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};


export const getProfile = async (): Promise<any> => {
  try {
    const { sessionId } = getStoredUserData();

    const response = await axios.get(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/profile/me`,
      {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );
    console.log("profile===",response.data)
    return response.data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};
