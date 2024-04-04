import {AddDefectRequest} from '../DTO/AddDefectRequest.ts';
import axios from 'axios';
import {DefectDto} from '../DTO/DefectDto.ts';
import * as Keychain from 'react-native-keychain';
import {Alert} from 'react-native';

const API_URL = 'http://10.0.2.2:5152/api/Defect';

export const DefectService = {
  async addDefect(defectData: AddDefectRequest): Promise<DefectDto | null> {
    const token = await Keychain.getGenericPassword({
      service: 'userTokenService',
    });
    const userId = await Keychain.getGenericPassword({
      service: 'userIdService',
    });
    if (token == null || userId == null) {
      Alert.alert('Error', 'Failed to authenticate');
    }
    try {
      const response = await axios.post<DefectDto>(`${API_URL}`, defectData);
      return response.data;
    } catch (error) {
      Alert.alert('Error', error);
      return null;
    }
  },

  async getMyDefects(): Promise<DefectDto[] | null> {
    const token = await Keychain.getGenericPassword({
      service: 'userTokenService',
    });
    const userId = await Keychain.getGenericPassword({
      service: 'userIdService',
    });
    if (token == null || userId == null) {
      Alert.alert('Error', 'Failed to authenticate');
    }
    try {
      const response = await axios.get<DefectDto[]>(`${API_URL}/my-defects`, {
        headers: {
          Authorization: `Bearer ${token.password}`,
          userId: `${userId.password}`,
        },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  },
  async getDefect(): Promise<void> {},
};
