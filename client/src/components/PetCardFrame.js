import React from "react";
import { CardGroup, Col, Container, Row } from "reactstrap";
import PetCard from "./PetCard";

function PetCardFrame(props) {
    let petRows = props.pets.map(pet => {
        return(
            <Col sm={props.sm} md={props.md} lg={props.lg} xl={props.xl} className="mb-4">
                <PetCard pet={pet}/>
            </Col>
        )
    });

    return (
        <div>
            <Container fluid>
                <Row className="justify-content-center">
                    {petRows}
                </Row>
            </Container>
        </div>
    );

}
export default PetCardFrame;