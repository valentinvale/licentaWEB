package com.example.FurEverHome.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1/pet")
public class PetController {

    private final PetService petService;

    @Autowired
    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping("/get")
    public List<Pet> getPets() {
        return petService.getPets();
    }

    @GetMapping("/getbyid/{petId}")
    public Pet getPet(@PathVariable("petId") UUID petId) {
        return petService.getPetById(petId);
    }

    @PostMapping("/add")
    public ResponseEntity<Pet> addPet(@RequestBody Pet pet) {
        Pet newPet = petService.addPet(pet);
        return ResponseEntity.ok(newPet);
    }

    @DeleteMapping(path = "/delete/{petId}")
    public void deletePet(@PathVariable("petId") UUID petId) {
        petService.deletePet(petId);
    }

    @PutMapping(path = "/update/{petId}")
    public void updatePet(@PathVariable("petId") UUID petId, @RequestParam(required = false) String name,
                          @RequestParam(required = false) String petType, @RequestParam(required = false) String breed,
                          @RequestParam(required = false) String description, @RequestParam(required = false) String birthDate,
                          @RequestParam(required = false) Integer age, @RequestParam(required = false) String judet, @RequestParam(required = false) String oras, @RequestParam(required = false) String sex) {
        petService.updatePet(petId, name, petType, breed, description, birthDate, age, judet, oras, sex);
    }

    @PutMapping(path = "/setpetuser/{petId}/{userId}")
    public void setPetUser(@PathVariable("petId") UUID petId, @PathVariable("userId") UUID userId) {
        petService.setPetUser(petId, userId);
    }

    @PutMapping(path = "/adoptpet/{petId}/{userId}")
    public void adoptPet(@PathVariable("petId") UUID petId, @PathVariable("userId") UUID userId) {
        petService.adoptPet(petId, userId);
    }

    @PutMapping(path = "/uploadimages/{petId}")
    public ResponseEntity<Pet> uploadImages(@PathVariable("petId") UUID petId, @RequestParam("images") MultipartFile[] images) {
        Pet updatedPet = petService.uploadImages(petId, images);
        return ResponseEntity.ok(updatedPet);
    }

}
