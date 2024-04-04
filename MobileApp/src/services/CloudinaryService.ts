import cloudinaryConfig from '../cloudinaryConfig.ts';
import axios from 'axios';
import { Alert } from "react-native";

export const CloudinaryService = {
  async uploadImageToCloudinary(imageUri: string) {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${imageUri}`,
    });
    formData.append('upload_preset', 'mobileApp');
    Alert.alert('error', 'here2'); //Ttutaj dochodzimy i dalej jest problem
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      Alert.alert('Upload successful', response.data);
      return response.data;
    } catch (error) {
      Alert.alert('Error uploading image', error);
    }
  },
};

export default CloudinaryService;
