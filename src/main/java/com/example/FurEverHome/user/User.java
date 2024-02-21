package com.example.FurEverHome.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "_user")
public class User {
    @Id
    private UUID id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String passwordHash;
}
