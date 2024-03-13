package com.example.FurEverHome.pet;

import com.example.FurEverHome.S3.S3Service;
import com.example.FurEverHome.user.User;
import com.example.FurEverHome.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class PetService {

    private final PetRepository petRepository;

    private final UserRepository userRepository;

    private final S3Service s3Service;

    @Autowired
    public PetService(PetRepository petRepository, UserRepository userRepository, S3Service s3Service) {
        this.petRepository = petRepository;
        this.userRepository = userRepository;
        this.s3Service = s3Service;
    }
    public List<Pet> getPets() {
        return petRepository.findAll();
    }

    public Pet addPet(Pet pet) {
        return petRepository.save(pet);
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

    public void setPetUser(UUID petId, UUID userId) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("User with id " + userId + " does not exist"));
        pet.setUser(user);
        petRepository.save(pet);
    }

    public void adoptPet(UUID petId, UUID userId) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("User with id " + userId + " does not exist"));
        if(pet.getHasBeenAdopted()) {
            throw new IllegalStateException("Pet with id " + petId + " has already been adopted");
        }
        else {
            pet.setAdoptiveUser(user);
            pet.setHasBeenAdopted(true);
            petRepository.save(pet);
        }

    }

    public Pet uploadImages(UUID petId, MultipartFile[] images) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));

        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : images) {
            // Generate a unique file name, upload to S3, and get the URL
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            //String Extension = Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf("."));
            String key = pet.getImageFolder() + "/" + fileName;
            String imageUrl = s3Service.uploadFile(key, file);
            imageUrls.add(imageUrl);
        }

        pet.setImageUrls(imageUrls);
        return petRepository.save(pet);
    }

    public Pet getPetById(UUID petId) {
        return petRepository.findById(petId).orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));
    }
}
