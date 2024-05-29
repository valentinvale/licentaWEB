import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/pet';

class PetService {
    async getPets() {
        return await axios.get(`${API_URL}/get`);
    }

    async getPetsSortedByDistance(latitude, longitude) {
        return await axios.get(`${API_URL}/getbydistance`, {
            params: {
                latitude: latitude,
                longitude: longitude
            }
        });
    }

    async getPetsFiltered(keyWords, county, city, latitude, longitude) {
        return await axios.get(`${API_URL}/getfiltered`, {
            params: {
                keyWords: keyWords,
                county: county,
                city: city,
                latitude: latitude,
                longitude: longitude
            }
        });
    }

    async getPetsByUserId(userId, token) {

        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        return await axios.get(`${API_URL}/getbyuser/${userId}`, config);
    }

    async getPetById(petId) {
        return await axios.get(`${API_URL}/getbyid/${petId}`);
    }

    async getRecentThreePets() {
        return await axios.get(`${API_URL}/getrecentthree`);
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