import {AddDefectRequest} from '../DTO/AddDefectRequest.ts';
import axios from 'axios';
import {DefectDto} from '../DTO/DefectDto.ts';

const API_URL = 'http://10.0.2.2:5152/api/Defect';

export const DefectService = {
  async addDefect(defectData: AddDefectRequest): Promise<DefectDto | null> {
    try {
      const response = await axios.post<DefectDto>(`${API_URL}`, defectData);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async getMyDefects(): Promise<void> {},
  async getMyDefect(): Promise<void> {},
};
