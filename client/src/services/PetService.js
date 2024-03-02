import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/pet';

class PetService {
    async getPet() {
        return await axios.get(`${API_URL}/get`);
    }
}
export default new PetService();