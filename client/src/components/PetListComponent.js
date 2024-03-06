import React from "react";
import PetService from "../services/PetService";
import UserService from "../services/UserService";

class PetListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pets: [],
            token: "",
            user: "",
            username: "",
            userEmail: ""
        };
    }

    getEmailFromToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
    
            return JSON.parse(jsonPayload).sub;
        } catch (e) {
            return null;
        }
    }

    isUserLoggedIn() {
        return localStorage.getItem("jwtToken") !== null;
    }

    componentDidMount() {
        PetService.getPet().then((response) => {
            this.setState({ pets: response.data });
        });
        if (this.isUserLoggedIn()) {
            const token = localStorage.getItem("jwtToken");
            this.setState({ token: token }, () => {
                const mail = this.getEmailFromToken(token);
                this.setState({ userEmail: mail });
                UserService.getUserByEmail(mail, token).then((response) => {
                    this.setState({ user: response.data });
                    //console.log(response.data);
                    this.setState({ username: response.data.username });
                });
            });
        }
    }
    
    render() {
        return (
        <div>
            <h1>Pet List</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Pet ID</th>
                        <th>Pet Name</th>
                        {/* <th>Pet Type</th>
                        <th>Pet Breed</th>
                        <th>Pet Age</th> */}
                    </tr>
                </thead>
                <tbody>
                    {this.state.pets.map((pet) => (
                    <tr key={pet.id}>
                        <td>{pet.id}</td>
                        <td>{pet.name}</td>
                        {/* <td>{pet.type}</td>
                        <td>{pet.breed}</td>
                        <td>{pet.age}</td> */}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        );
    }
}
export default PetListComponent;