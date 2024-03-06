import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

class AuthenticationService {
    async register(registerRequest) {
        return await axios.post(`${API_URL}/register`, registerRequest);
    }

    async authenticate(authenticationRequest) {
        return await axios.post(`${API_URL}/authenticate`, authenticationRequest);
    }   

    async logOut(){
        localStorage.removeItem("jwtToken");
    }

    async decodeToken(token){
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
    
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    async isTokenExpired(token){
        const decodedToken = await this.decodeToken(token);
        if(decodedToken === null){
            return true;
        }
        const currentTime = Date.now() / 1000;
        // console.log(decodedToken.exp);
        // console.log(currentTime);
        // console.log(decodedToken.exp < currentTime);
        return decodedToken.exp < currentTime;
    }
}
export default new AuthenticationService();