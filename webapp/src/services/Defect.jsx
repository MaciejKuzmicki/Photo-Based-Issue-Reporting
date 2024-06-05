import axios from 'axios';

const API_URL = 'http://localhost:5152/api/Defect';

export const DefectService = {
    async getDefects(isFixed, category) {
        try {
            const response = await axios.get(`${API_URL}?IsFixed=${isFixed}&Category=${category}`, {
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
                } else if (error.response && error.response.data && error.response.status === 404){
                    //alert('Error: There is no defects');
                }
            } else {
                alert('Error: An unexpected error occurred');
            }
            return null;
        }
    },

    async markAsFixed(defectId) {
        try {
            const response = await axios.put(`${API_URL}/${defectId}`, {},  {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    userId: `${localStorage.getItem('id')}`,
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = 'An unexpected error occurred';
                if (error.response) {
                    const errors = error.response.data.errors || {};
                    const firstErrorKey = Object.keys(errors)[0];
                    const firstError = errors[firstErrorKey];
                    if (firstError) {
                        alert(`Error: ${firstError[0]}`);
                    } else if (error.response.data.message) {
                        alert(`Error: ${error.response.data.message}`);
                    } else {
                        alert(`Error: ${errorMessage}`);
                    }
                } else {
                    alert(`Error: ${errorMessage}`);
                }
            } else {
                alert('Error: An unexpected error occurred');
            }
            return null;
        }
    }
}
