import React from "react";
import PetService from "../services/PetService";

class PetListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pets: []
        };
    }

    componentDidMount() {
        PetService.getPet().then((response) => {
            this.setState({ pets: response.data });
        });
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