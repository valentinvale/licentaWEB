package com.example.FurEverHome.user;

import com.example.FurEverHome.reports.Report;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class UserSafeDTO {
    private UUID id;
    private String username;
    private String firstName;
    private String lastName;
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private Role role;
    private Set<Report> reportsAgainstUser;
    private Set<Report> reportsByUser;

    public static UserSafeDTO fromUser(User user) {
        UserSafeDTO userDTO = new UserSafeDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getRealUsername());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setRole(user.getRole());
        userDTO.setReportsAgainstUser(user.getReportsAgainstUser());
        userDTO.setReportsByUser(user.getReportsByUser());
        return userDTO;
    }
}