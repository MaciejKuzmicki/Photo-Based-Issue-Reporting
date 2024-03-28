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
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import CustomButton from '../components/CustomButton.tsx';
import {AddDefectRequest} from '../DTO/AddDefectRequest.ts';
import Geolocation from 'react-native-geolocation-service';

const AddDefectScreen = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleAddDefect = async () => {
    const defectData: AddDefectRequest = {
      description,
      location,
    };
    await requestLocationPermission();
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
        setLocation(locString); // Store location string
        Alert.alert('Success', locString);
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
        placeholder="Enter your text here"
        onChangeText={setDescription}
        value={description}
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
  },
});
export default AddDefectScreen;
