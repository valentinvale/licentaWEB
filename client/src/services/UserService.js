import axios from "axios";
import AuthenticationService from "./AuthenticationService";
const API_URL = "http://localhost:8080/api/v1/user";

class UserService {
  async getUserByEmail(email, token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return await axios.get(`${API_URL}/getbyemail/${email}`, config);
  }

  async getUserByToken(token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const email = AuthenticationService.getEmailFromToken(token);

    return await axios.get(`${API_URL}/getbyemail/${email}`, config);
  }

  async getUserById(id, token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return await axios.get(`${API_URL}/getbyid/${id}`, config);
  }

  async getUserByIdSafe(id) {
    return await axios.get(`${API_URL}/getbyidsafe/${id}`);
  }

  async getUsernameById(id, token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return await axios.get(`${API_URL}/getusername/${id}`, config);
  }

}
export default new UserService();