import React, {useState} from 'react';

import {View, TextInput, StyleSheet, Text, Image, Alert} from 'react-native';
import {LoginRequest} from '../DTO/LoginRequest.ts';
import axios from 'axios';
import {AuthService} from '../services/AuthService.ts';
import CustomButton from '../components/CustomButton.tsx';
import CustomImage from '../components/CustomImage.tsx';

// @ts-ignore
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    const loginData: LoginRequest = {
      email,
      password,
    };
    const response = await AuthService.login(loginData);
    if (response != null) {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <CustomImage source="https://res.cloudinary.com/dxmsosoui/image/upload/v1711144136/lxyglrxfoubhx5v9jfiv.webp" />
      <Text style={styles.title}>Enter your data</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <CustomButton press={handleLogin} text="Login" type="primary" />
      <CustomButton
        press={() => navigation.navigate('Register')}
        text="Don't have an account? Sign Up"
        type="secondary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default LoginScreen;
