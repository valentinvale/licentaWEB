package com.example.FurEverHome.pet;

import com.example.FurEverHome.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;

@Entity
@Table
public class Pet {

    @Id
    private UUID id;
    private String name;
    private String petType;
    private String breed;
    private LocalDate birthDate;
    private String judet;
    private String oras;
    //private String adresa;
    @Transient
    private Integer age;
    private String description;
    private LocalDate dateAdded;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private boolean hasBeenAdopted;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "adoptive_user_id", referencedColumnName = "id")
    private User adoptiveUser;

    public Pet() {
        this.id = UUID.randomUUID();
        this.hasBeenAdopted = false;
        this.dateAdded = LocalDate.now();
    }

    public Pet(String name, String petType, String breed, LocalDate birthDate, String description, String judet, String oras) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.petType = petType;
        this.breed = breed;
        this.age = Period.between(birthDate, LocalDate.now()).getYears();
        this.birthDate = birthDate;
        this.description = description;
        this.dateAdded = LocalDate.now();
        this.judet = judet;
        this.oras = oras;
        this.hasBeenAdopted = false;
    }

    public Pet(String name, String petType, String breed, Integer age, String description, String judet, String oras) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.petType = petType;
        this.breed = breed;
        this.age = age;
        this.description = description;
        this.dateAdded = LocalDate.now();
        this.judet = judet;
        this.oras = oras;
        this.hasBeenAdopted = false;
    }

    public Pet(String name, String petType, String breed, String description, String judet, String oras) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.petType = petType;
        this.breed = breed;
        this.description = description;
        this.dateAdded = LocalDate.now();
        this.judet = judet;
        this.oras = oras;
        this.hasBeenAdopted = false;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPetType() {
        return petType;
    }

    public void setPetType(String petType) {
        this.petType = petType;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }
    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
    public Integer getAge() {
        return age;
    }

    public LocalDate getDateAdded() {
        return dateAdded;
    }
    public void setAge(Integer age) {
        this.age = age;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
    }

    public String getJudet() {
        return judet;
    }

    public void setJudet(String judet) {
        this.judet = judet;
    }

    public String getOras() {
        return oras;
    }

    public void setOras(String oras) {
        this.oras = oras;
    }
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean getHasBeenAdopted() {
        return hasBeenAdopted;
    }

    public void setHasBeenAdopted(boolean hasBeenAdopted) {
        this.hasBeenAdopted = hasBeenAdopted;
    }

    public User getAdoptiveUser() {
        return adoptiveUser;
    }

    public void setAdoptiveUser(User adoptiveUser) {
        this.adoptiveUser = adoptiveUser;
    }

    @Override
    public String toString() {
        return "Pet{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", petType='" + petType + '\'' +
                ", breed='" + breed + '\'' +
                ", birthDate=" + birthDate +
                ", age=" + age +
                ", description='" + description + '\'' +
                ", dateAdded='" + dateAdded + "\'" +
                '}';

    }
}
