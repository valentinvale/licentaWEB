package com.example.FurEverHome.pet;

import jakarta.transaction.Transactional;
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

    public void deletePet(UUID petId) {
        boolean petExists = petRepository.existsById(petId);
        if (!petExists) {
            throw new IllegalStateException("Pet with id " + petId + " does not exist");
        }
        petRepository.deleteById(petId);
    }

    @Transactional
    public void updatePet(UUID petId, String name, String petType, String breed, String description, String birthDate, Integer age) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));

        if (name != null && !name.isEmpty() && !name.equals(pet.getName())) {
            pet.setName(name);
        }

        if (petType != null && !petType.isEmpty() && !petType.equals(pet.getPetType())) {
            pet.setPetType(petType);
        }

        if (breed != null && !breed.isEmpty() && !breed.equals(pet.getBreed())) {
            pet.setBreed(breed);
        }

        if (description != null && !description.isEmpty() && !description.equals(pet.getDescription())) {
            pet.setDescription(description);
        }

        if (birthDate != null && !birthDate.isEmpty()) {
            pet.setBirthDate(LocalDate.parse(birthDate));
        }

        if (age != null && age > 0 && !age.equals(pet.getAge())) {
            pet.setAge(age);
        }
    }
}
