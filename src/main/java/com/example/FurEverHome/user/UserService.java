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
}
