import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  Image,
} from 'react-native';
import {RegisterRequest} from '../DTO/RegisterRequest.ts';
import {AuthService} from '../services/AuthService.ts';
import CustomButton from '../components/CustomButton.tsx';
import CustomImage from '../components/CustomImage.tsx';

// @ts-ignore
const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleRegister = async () => {
    const registerData: RegisterRequest = {
      name,
      lastname,
      email,
      password,
    };
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords are not the same');
      return;
    }
    const response = await AuthService.register(registerData);
    if (response !== -1) {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <CustomImage source="https://res.cloudinary.com/dxmsosoui/image/upload/v1711144136/lxyglrxfoubhx5v9jfiv.webp" />
      <Text style={styles.title}>Create an account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last name"
        value={lastname}
        onChangeText={setLastname}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      <CustomButton text="Register" press={handleRegister} type="primary" />
      <CustomButton
        text="Already have an account? Login"
        press={() => navigation.navigate('Login')}
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

export default RegisterScreen;
