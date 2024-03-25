import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/ai';

class AIService {
    async generatePetName(image, token){
        const formData = new FormData();
        formData.append("image", image);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        };

        return await axios.post(`${API_URL}/generate-pet-name`, formData, config);
    }
}
export default new AIService();