
import axios from 'axios';

import sha1 from 'crypto-js/sha1';

const CLOUD_NAME = "igitego-hotels";
const CLOUD_API_KEY = "267452981263158";
const CLOUD_API_KEY_SECRET = "7sos9chKWrMDK0LubhPpCd37JBo";

export async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Generate signature
  const signatureString = `folder=${folder}&timestamp=${timestamp}${CLOUD_API_KEY_SECRET}`;
  const signature = sha1(signatureString).toString();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', CLOUD_API_KEY);
  formData.append('signature', signature);
  formData.append('folder', folder);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data.secure_url;
}
