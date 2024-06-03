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

  async updateUserFeatures(id, features, token) {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    const params = new URLSearchParams(features).toString();
    const url = `${API_URL}/updatefeatures/${id}?${params}`;

    console.log("Token:", token);
    console.log("Features URL:", url);

    return await axios.put(url, {}, config);
}

  async addFavoritePet(userId, petId, token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return await axios.post(`${API_URL}/addfavorite/${userId}/${petId}`, {}, config);
  }

  async removeFavoritePet(userId, petId, token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return await axios.post(`${API_URL}/removefavorite/${userId}/${petId}`, {}, config);
  }

  async getFavoritePets(userId, token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return await axios.get(`${API_URL}/getfavorites/${userId}`, config);
  }

  async checkIfFavorite(userId, petId, token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return await axios.get(`${API_URL}/checkiffavorite/${userId}/${petId}`, config);
  }

}
export default new UserService();