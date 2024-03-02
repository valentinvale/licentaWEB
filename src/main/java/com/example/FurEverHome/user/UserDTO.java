package com.example.FurEverHome.user;

import jakarta.persistence.Enumerated;
import lombok.Data;

import java.util.UUID;
@Data
public class UserDTO {
    private UUID id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private Role role;

    public static UserDTO fromUser(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getRealUsername());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

}
