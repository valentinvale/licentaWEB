package com.example.FurEverHome.user;

import com.example.FurEverHome.reports.Report;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.util.Set;
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
    private Set<Report> reportsAgainstUser;
    private Set<Report> reportsByUser;
    private Integer activityLevel;

    public static UserDTO fromUser(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getRealUsername());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setReportsAgainstUser(user.getReportsAgainstUser());
        userDTO.setReportsByUser(user.getReportsByUser());
        userDTO.setActivityLevel(user.getActivityLevel());
        return userDTO;
    }
}