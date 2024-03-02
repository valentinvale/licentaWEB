import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

class AuthenticationService {
    async register(registerRequest) {
        return await axios.post(`${API_URL}/register`, registerRequest);
    }

    async authenticate(authenticationRequest) {
        return await axios.post(`${API_URL}/authenticate`, authenticationRequest);
    }   
}
export default new AuthenticationService();