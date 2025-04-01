import React from "react";
import axios from "axios";
import { getStoredUserData } from "../signin";
import toast from "react-hot-toast";

import { uploadToCloudinary } from "../../utils/uploadImg";
import { UserProfile } from "../../types/profile";


interface SearchFilters {
  role?: string;
  skills?: string;
  experienceMin?: string;
  location?: string;
}

interface SearchResponse {
  success: boolean;
  profiles?: UserProfile[];
  message?: string;
  page?: number;
  totalProfiles?: number;
  totalPages?: number;
}

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
    return response.data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};


export const getProfileByName = async (name: string) => {
  try {
    const response = await fetch(`${(import.meta as any).env.VITE_CANISTER_ORIGIN}/profiles/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name })
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching profile by name:", error);
    return { success: false, message: "Failed to fetch profile" };
  }
};

export const searchUsers = async (query: string, filters: SearchFilters = {}): Promise<SearchResponse> => {
  try {
    const requestBody: Record<string, any> = {

      ...(query && { name: query }),
      
      
      role: "developer",
      ...(filters.skills && { skills: filters.skills }),
      ...(filters.experienceMin && { experienceMin: filters.experienceMin }),
      ...(filters.location && { district: filters.location }),
      
      page: 1,
      limit: 10
    };
    
    const response = await fetch(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/profiles/search`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );
    
    return await response.json() as SearchResponse;
  } catch (error) {
    console.error("Error searching users:", error);
    return { success: false, message: "Failed to search users" };
  }
};