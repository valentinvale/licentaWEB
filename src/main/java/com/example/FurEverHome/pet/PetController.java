package com.example.FurEverHome.pet;

import com.example.FurEverHome.email.EmailService;
import com.example.FurEverHome.user.UserService;
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
    private final UserService userService;
    private final EmailService emailService;

    @Autowired
    public PetController(PetService petService, UserService userService, EmailService emailService) {
        this.petService = petService;
        this.userService = userService;
        this.emailService = emailService;
    }

    @GetMapping("/get")
    public List<Pet> getPets() {
        return petService.getPets();
    }

    @GetMapping("/getbydistance")
    public List<Pet> getPetsSortedByDistance(
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude) {
        return petService.getPetsSortedByDistance(latitude, longitude);
    }

    @GetMapping("/getbyuser/{userId}")
    public List<Pet> getPetsByUser(@PathVariable("userId") UUID userId) {
        return petService.getPetsByUser(userId);
    }

    @GetMapping("/getbyadoptiveuser/{userId}")
    public List<Pet> getPetsByAdoptiveUser(@PathVariable("userId") UUID userId) {
        return petService.getPetsByAdoptiveUser(userId);
    }

    @GetMapping("/getbyid/{petId}")
    public Pet getPet(@PathVariable("petId") UUID petId) {
        return petService.getPetById(petId);
    }

    @GetMapping("/getfiltered")
    public List<Pet> getFilteredPets(@RequestParam(required = false) String keyWords, @RequestParam(required = false) String county,
                                     @RequestParam(required = false) String city, @RequestParam(required = false) Double latitude,
                                     @RequestParam(required = false) Double longitude) {
        return petService.getFilteredPets(keyWords, county, city, latitude, longitude);
    }

    @GetMapping("/getrecentthree")
    public List<Pet> getRecentThreePets() {
        return petService.getRecentThreePets();
    }

    @GetMapping("/getsortedbycompatibility/{userId}")
    public List<Pet> getPetsSortedByCompatibility(@PathVariable("userId") UUID userId) {
        return petService.getPetsSortedByCompatibility(userId);
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
    public ResponseEntity<String> adoptPet(@PathVariable("petId") UUID petId, @PathVariable("userId") UUID userId) {
        try {
            petService.adoptPet(petId, userId);
            return ResponseEntity.ok("Pet adoption successful");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred");
        }
    }

    @PutMapping(path = "/uploadimages/{petId}")
    public ResponseEntity<Pet> uploadImages(@PathVariable("petId") UUID petId, @RequestParam("images") MultipartFile[] images) {
        Pet updatedPet = petService.uploadImages(petId, images);
        return ResponseEntity.ok(updatedPet);
    }

    @PostMapping("/sendconfirmation")
    public ResponseEntity<String> sendConfirmationEmail(@RequestParam("userId") UUID userId,
                                                        @RequestParam("petId") UUID petId) {

        String userEmail = userService.getEmailById(userId.toString());
        String confirmationLink = "http://localhost:3000/confirm-adoption?userId=" + userId + "&petId=" + petId;
        Pet pet = petService.getPetById(petId);
        String subject = "Confirmare adoptie pentru " + pet.getName();
        String text = "Salut! " + "!\n\n" +
                "Felicitari! Ai primit o cerere de adoptie pentru " + pet.getName() + ".\n" +
                "Daca doresti sa accepti cererea, te rugam sa accesezi link-ul de mai jos:\n" +
                confirmationLink + "\n\n" +
                "Daca nu doresti sa accepti cererea, te rugam sa ignori acest mesaj.\n\n" +
                "Cu drag,\nEchipa FurEverHome";
        emailService.sendEmail(userEmail, subject, text);
        return ResponseEntity.ok("Email sent successfully");
    }

}
