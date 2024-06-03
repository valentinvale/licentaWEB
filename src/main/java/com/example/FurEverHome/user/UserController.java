package com.example.FurEverHome.user;

import com.example.FurEverHome.pet.Pet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("api/v1/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/get")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/getbyemail/{email}")
    @PreAuthorize("#email == authentication.principal.username or hasAnyRole('ADMIN')")
    public UserDTO getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/getbyid/{userId}")
    public UserDTO getUserById(@PathVariable String userId) {
        return userService.getUserById(userId);
    }

    @GetMapping("/getbyidsafe/{userId}")
    public UserSafeDTO getUserByIdSafe(@PathVariable String userId) {
        return userService.getUserByIdSafe(userId);
    }

    @GetMapping("/getusername/{userId}")
    public String getUsernameById(@PathVariable String userId) {
        return userService.getUsernameById(userId);
    }

    @GetMapping("/getemailbyid/{userId}")
    public String getEmailById(@PathVariable String userId) {
        return userService.getEmailById(userId);
    }

    @PutMapping("/makeadmin/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public void makeAdmin(@PathVariable String userId) {
        userService.makeAdmin(userId);
    }

    @PutMapping("/updatefeatures/{userId}")
    public void updateFeatures(@PathVariable String userId, @RequestParam(required = true) Integer activityLevel, @RequestParam(required = true) Integer hasChildren, @RequestParam(required = true) Integer hasOtherPets, @RequestParam(required = true) Integer hypoallergenic, @RequestParam(required = true) Integer livingEnvironment, @RequestParam(required = true) Integer lowMaintenance, @RequestParam(required = true) Integer personality, @RequestParam(required = true) Integer workSchedule) {
        userService.updateFeatures(userId, activityLevel, hasChildren, hasOtherPets, hypoallergenic, livingEnvironment, lowMaintenance, personality, workSchedule);
    }

    @PostMapping("/addfavorite/{userId}/{petId}")
    public void addFavorite(@PathVariable String userId, @PathVariable String petId) {
        userService.addFavorite(userId, petId);
    }

    @PostMapping("/removefavorite/{userId}/{petId}")
    public void removeFavorite(@PathVariable String userId, @PathVariable String petId) {
        userService.removeFavorite(userId, petId);
    }

    @GetMapping("/getfavorites/{userId}")
    public Set<Pet> getFavorites(@PathVariable String userId) {
        return userService.getFavorites(userId);
    }

    @GetMapping("/checkiffavorite/{userId}/{petId}")
    public boolean checkIfFavorite(@PathVariable String userId, @PathVariable String petId) {
        return userService.checkIfFavorite(userId, petId);
    }
}
