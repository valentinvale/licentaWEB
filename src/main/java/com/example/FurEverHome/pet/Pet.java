package com.example.FurEverHome.pet;

import com.example.FurEverHome.user.User;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;
import java.util.logging.Logger;

@Entity
@Table
public class Pet {
    @Id
    @GeneratedValue(generator = "uuid2", strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private String petType;
    private String breed;
    private LocalDate birthDate;
    private String judet;
    private String oras;
    //private String adresa;
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
        this.hasBeenAdopted = false;
        this.dateAdded = LocalDate.now();
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
        if(age == null && birthDate != null) {
            return Period.between(birthDate, LocalDate.now()).getYears();
        }
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
