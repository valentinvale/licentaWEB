import React, { useEffect } from "react";
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

function PetCard(props) {

    useEffect(() => {
        console.log("PetCard props: ", props);
    }, [props]);

    const petPath = `/pets/${props.pet.id}`

    return (
        <Link to={petPath} className="pet-card-link">
            <Card className="pet-card">
                <CardImg className="pet-card-img" top src={props.pet.imageUrls[0]} alt="Pet Card image" />
                <CardBody className="pet-card-body">
                    <CardTitle>{props.pet.name}</CardTitle>
                    <CardSubtitle>{props.pet.breed}</CardSubtitle>
                    <CardText className="pet-card-text"><i class="bi bi-geo-alt"></i>{" " + props.pet.oras + ", " + props.pet.judet}</CardText>
                    <CardText className="pet-card-text">{props.pet.description}</CardText>
                </CardBody>
            </Card>
        </Link>
    );
}
export default PetCard;