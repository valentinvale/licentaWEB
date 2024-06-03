package com.example.FurEverHome.user;

import com.example.FurEverHome.pet.Pet;
import com.example.FurEverHome.reports.Report;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Data
@Entity
@Table(name = "_user")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(generator = "uuid2", strategy = GenerationType.AUTO)
    private UUID id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String password;

    @Nullable
    private Integer personality; // 1 for extroverted, 0 for introverted
    @Nullable
    private Integer activityLevel; // 0 for sedentary, 1 for moderately-active, 2 for very-active
    @Nullable
    private Integer workSchedule; // 0 for full-time, 1 for part-time, 2 for remote
    @Nullable
    private Integer livingEnvironment; // 0 for apartment, 1 for house-with-yard
    @Nullable
    private Integer hasChildren; // 1 for yes, 0 for no
    @Nullable
    private Integer hasOtherPets; // 1 for yes, 0 for no
    @Nullable
    private Integer hypoallergenic; // 1 for yes, 0 for no
    @Nullable
    private Integer lowMaintenance; // 1 for yes, 0 for no

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private Set<Pet> pets = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "adoptiveUser")
    private Set<Pet> adoptedPets = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "reportedUser")
    private Set<Report> reportsAgainstUser = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "reportingUser")
    private Set<Report> reportsByUser = new HashSet<>();

    @Enumerated(jakarta.persistence.EnumType.STRING)
    private Role role;

    // flags and ratings to be added

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getRealUsername() {
        return username;
    }




}
