import {LoginRequest} from '../DTO/LoginRequest.ts';
import {LoginResponse} from '../DTO/LoginResponse.ts';
import axios from 'axios';
import {RegisterRequest} from '../DTO/RegisterRequest.ts';
import * as Keychain from 'react-native-keychain';
import {Alert} from 'react-native';

const API_URL = 'http://10.0.2.2:5152/api/Auth';

export const AuthService = {
  async login(loginData: LoginRequest): Promise<LoginResponse | null> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/login`,
        loginData,
      );
      await Keychain.setGenericPassword('userEmail', response.data.email, {
        service: 'userEmailService',
      });
      await Keychain.setGenericPassword('userName', response.data.name, {
        service: 'userNameService',
      });
      await Keychain.setGenericPassword(
        'userLastname',
        response.data.lastName,
        {service: 'userLastnameService'},
      );
      await Keychain.setGenericPassword('userId', response.data.id, {
        service: 'userIdService',
      });
      await Keychain.setGenericPassword('userToken', response.data.token, {
        service: 'userTokenService',
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.status === 400
        ) {
          const errors = error.response.data.errors || {};
          const firstError = errors[Object.keys(errors)[0]];
          const errorMessage = firstError
            ? firstError[0]
            : 'An unexpected error occurred';
          Alert.alert('Error', errorMessage);
        } else {
          Alert.alert('Error', 'An unexpected error occurred');
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
      return null;
    }
  },

  async register(registerData: RegisterRequest): Promise<void | number> {
    //Alert.alert('Success', registerData.email);
    try {
      const response = await axios.post<void>(
        `${API_URL}/register`,
        registerData,
      );
      return;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          (error.response.status === 400 || error.response.status === 422)
        ) {
          let errors = error.response.data.errors || {};
          let firstErrorMessage = 'An unexpected error occurred';

          if (typeof errors === 'string') {
            firstErrorMessage = errors;
          } else if (Object.keys(errors).length > 0) {
            const firstErrorKey = Object.keys(errors)[0];
            const firstError = errors[firstErrorKey];
            firstErrorMessage = Array.isArray(firstError)
              ? firstError[0]
              : firstError || firstErrorMessage;
          }

          Alert.alert('Registration Error', firstErrorMessage);
        } else {
          Alert.alert('Error', 'An unexpected error occurred');
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
      return -1;
    }
  },
};
