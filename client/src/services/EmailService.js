import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/pet';

class EmailService {
    async sendAdoptConfirmationEmail(userId, petId, token) {
        console.log("Sending confirmation email to:", userId, "for pet:", petId);
        console.log("Token:", token);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            params: {
                userId: userId,
                petId: petId
            }
        };

        return await axios.post(`${API_URL}/sendconfirmation`, {}, config);
    }
}
export default new EmailService();
