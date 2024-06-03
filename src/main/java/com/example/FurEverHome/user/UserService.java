package com.example.FurEverHome.user;

import com.example.FurEverHome.pet.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PetRepository petRepository;

    @Autowired
    public UserService(UserRepository userRepository, PetRepository petRepository) {
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return UserDTO.fromUser(user);
    }

    public UserDTO getUserById(String userId) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new RuntimeException("User not found"));
        return UserDTO.fromUser(user);
    }

    public String getUsernameById(String userId) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getRealUsername();
    }

    public String getEmailById(String userId) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getEmail();
    }

    public UserSafeDTO getUserByIdSafe(String userId) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new RuntimeException("User not found"));
        return UserSafeDTO.fromUser(user);
    }

    public void makeAdmin(String userId) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }

    public void updateFeatures(String userId, Integer activityLevel, Integer hasChildren, Integer hasOtherPets, Integer hypoallergenic, Integer livingEnvironment, Integer lowMaintenance, Integer personality, Integer workSchedule) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActivityLevel(activityLevel);
        user.setHasChildren(hasChildren);
        user.setHasOtherPets(hasOtherPets);
        user.setHypoallergenic(hypoallergenic);
        user.setLivingEnvironment(livingEnvironment);
        user.setLowMaintenance(lowMaintenance);
        user.setPersonality(personality);
        user.setWorkSchedule(workSchedule);
        userRepository.save(user);
    }
}
