package com.example.FurEverHome.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class PetService {

    private final PetRepository petRepository;

    @Autowired
    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }
    public List<Pet> getPets() {
        return petRepository.findAll();
    }

    public void addPet(Pet pet) {
        petRepository.save(pet);
    }
}
