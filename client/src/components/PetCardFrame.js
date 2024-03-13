import React from "react";
import { CardGroup, Col, Container, Row } from "reactstrap";
import PetCard from "./PetCard";

function PetCardFrame(props) {
    let petRows = props.pets.map(pet => {
        return(
            <Col sm="12" md="6" lg="4" xl="3" className="mb-4">
                <PetCard pet={pet}/>
            </Col>
        )
    });

    return (
        <div>
            <Container>
                <Row>
                    {petRows}
                </Row>
            </Container>
        </div>
    );

}
export default PetCardFrame;