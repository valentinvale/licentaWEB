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

}