import axios from "axios";
const API_URL = "http://localhost:8080/api/v1/user";

class UserService {
  async getUserByEmail(email, token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return await axios.get(`${API_URL}/getbyemail/${email}`, config);
  }
}
export default new UserService();