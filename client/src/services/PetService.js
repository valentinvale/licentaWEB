import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/pet';

class PetService {
    async getPet() {
        return await axios.get(`${API_URL}/get`);
    }

    async postPet(petRequest, token) {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        return await axios.post(`${API_URL}/add`, petRequest, config);
    }

    async setPetUser(petId, userId, token) {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        return await axios.put(`${API_URL}/setpetuser/${petId}/${userId}`, null, config);
    }

    async uploadPetImages(petId, images, token) {
        const formData = new FormData();
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }
    
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };
    
        return await axios.put(`${API_URL}/uploadimages/${petId}`, formData, config);
    }
    

}
export default new PetService();