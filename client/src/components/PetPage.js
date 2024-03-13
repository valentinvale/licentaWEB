import React from "react";
import PetService from "../services/PetService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import '../Styles/PetPage.css';

import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
  } from 'reactstrap';

function PetPage(args) {
    const { id } = useParams();
    const [pet, setPet] = useState({});

    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const items = pet.imageUrls ? pet.imageUrls.map((url, index) => {
        return {
            src: url,
            altText: pet.name,
            caption: pet.name,
            key: index
        };
    }) : [];

    useEffect(() => {
        PetService.getPetById(id).then((response) => {
            setPet(response.data);
        });
    }, [id]);


    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const slides = items.map((item) => {
        return (
        <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={item.src}
        >
            <img src={item.src} alt={item.altText} className="custom-carousel-img"/>
            <CarouselCaption
            captionText={item.caption}
            captionHeader={item.caption}
            />
        </CarouselItem>
        );
    });

    return (
        <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        className="custom-carousel"
        {...args}
        >
        <CarouselIndicators
            items={items}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
        />
        {slides}
        <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={previous}
        />
        <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={next}
        />
        </Carousel>
    );

}
export default PetPage;