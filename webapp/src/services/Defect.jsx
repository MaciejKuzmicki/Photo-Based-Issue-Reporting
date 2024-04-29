import axios from 'axios';

const API_URL = 'http://localhost:5152/api/Defect';

export const DefectService = {
    async getDefects() {
        try {
            const response = await axios.get(`${API_URL}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                        userId: `${localStorage.getItem('id')}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data && error.response.status === 400) {
                    const errors = error.response.data.errors || {};
                    const firstErrorKey = Object.keys(errors)[0];
                    const firstError = errors[firstErrorKey];
                    const errorMessage = firstError ? firstError[0] : 'An unexpected error occurred';
                    alert(`Error: ${errorMessage}`);
                } else {
                    alert('Error: An unexpected error occurred');
                }
            } else {
                alert('Error: An unexpected error occurred');
            }
            return null;
        }

    }
}