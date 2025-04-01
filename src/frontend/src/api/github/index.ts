import axios from "axios";

export const fetchGitHubAccessToken = async (code: string) => {
  try {
    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/getAccessToken`, 
      { code }
    );
    
    if (response.data.access_token) {
      // Store token in localStorage for future use
      localStorage.setItem("githubAccessToken", response.data.access_token);
      return response.data.access_token;
    }
    
    throw new Error("No access token received");
  } catch (error) {
    console.error("Error fetching GitHub access token:", error);
    throw error;
  }
};

export const fetchGitHubUserData = async (accessToken: string) => {
  try {
    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/getUserData`, 
      { accessToken }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub user data:", error);
    throw error;
  }
};

  export const connectWithGithub = () => {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${(import.meta as any).env.VITE_CLIENT_ID}`);
  };