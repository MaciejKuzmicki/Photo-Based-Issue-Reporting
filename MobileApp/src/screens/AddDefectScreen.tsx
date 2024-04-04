import React, {useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
  Image,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import CustomButton from '../components/CustomButton.tsx';
import {AddDefectRequest} from '../DTO/AddDefectRequest.ts';
import Geolocation from 'react-native-geolocation-service';
import {launchCamera} from 'react-native-image-picker';
import CustomImage from '../components/CustomImage.tsx';
import CloudinaryService from '../services/CloudinaryService.ts';
import { DefectService } from "../services/DefectService.ts";

const AddDefectScreen = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [cloudinary, setCloudinary] = useState('');

  const handleAddDefect = async () => {
    await requestLocationPermission();
    if (image) {
      setCloudinary(await CloudinaryService.uploadImageToCloudinary(image));
    }
    const defectData: AddDefectRequest = {
      description: description,
      location: location,
      imageUrl: cloudinary,
    };
    const result = await DefectService.addDefect(defectData);
  };

  const handleImageUpload = async () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
    };
    await launchCamera(options, response => {
      if (response.didCancel) {
        Alert.alert('Error', 'Cancelled photo upload');
      } else if (response.errorCode) {
        Alert.alert('Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = {uri: response.assets[0].uri};
        setImage(source.uri);
      }
    });
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location required',
          message: 'We need your location know where the problem is',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        fetchLocation();
      } else {
        Alert.alert('Error', 'Permission denied');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const fetchLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const locString = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        setLocation(locString);
      },
      error => {
        Alert.alert('Error fetching location', error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Describe the problem..."
        onChangeText={setDescription}
        value={description}
      />
      {image && <CustomImage source={image} />}
      <CustomButton
        press={handleImageUpload}
        text="Add Image"
        type="secondary"
      />
      <CustomButton press={handleAddDefect} text="Confirm" type="primary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  textInput: {
    height: 100,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 20,
  },
});
export default AddDefectScreen;
