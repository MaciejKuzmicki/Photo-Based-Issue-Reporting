import React, {useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import CustomButton from '../components/CustomButton.tsx';
import {AddDefectRequest} from '../DTO/AddDefectRequest.ts';
import Geolocation from 'react-native-geolocation-service';
import {launchCamera} from 'react-native-image-picker';
import CustomImage from '../components/CustomImage.tsx';
import CloudinaryService from '../services/CloudinaryService.ts';
import {DefectService} from '../services/DefectService.ts';
import {ReverseGeocodingService} from '../services/ReverseGeocodingService.ts';

// @ts-ignore
const AddDefectScreen = ({navigation}) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  let name: string | null = '';

  const handleAddDefect = async () => {
    const location = await requestLocationPermission();
    if (!image) {
      Alert.alert('Error', 'No image selected');
    }
    const imageUrl = await CloudinaryService.uploadImageToCloudinary(image);
    if (name == null) {
      return;
    }
    const defectData: AddDefectRequest = {
      description: description,
      location: location,
      imageUrl: imageUrl,
      locationName: name,
    };
    const result = await DefectService.addDefect(defectData);
    if (result != null) {
      navigation.navigate('Home', {shouldRefresh: true});
    }
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
        return await fetchLocation();
      } else {
        Alert.alert('Error', 'Permission denied');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const fetchLocation = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          resolve(
            `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
          );
          const address = await ReverseGeocodingService.getAddress(
            latitude,
            longitude,
          );
          if (address == null) {
            Alert.alert('Error', 'Failed to fetch location');
          }
          name = address;
        },
        error => {
          Alert.alert('Error fetching location', error.message);
          reject(new Error('Error fetching location'));
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
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
