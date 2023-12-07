package com.example.FurEverHome.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/add")
    public void addPet(@RequestBody Pet pet) {
        petService.addPet(pet);
    }

}
