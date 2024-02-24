package com.example.FurEverHome.pet;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

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

    public Pet() {
        this.id = UUID.randomUUID();
    }

    public Pet(UUID id, String name, String petType, String breed, LocalDate birthDate, String description, String judet, String oras) {
        this.id = id;
        this.name = name;
        this.petType = petType;
        this.breed = breed;
        this.birthDate = birthDate;
        this.description = description;
        this.dateAdded = LocalDate.now();
        this.judet = judet;
        this.oras = oras;
    }

    public Pet(String name, String petType, String breed, LocalDate birthDate, Integer age, String description, String judet, String oras) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.petType = petType;
        this.breed = breed;
        this.birthDate = birthDate;
        this.description = description;
        this.dateAdded = LocalDate.now();
        this.judet = judet;
        this.oras = oras;
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
        return Period.between(this.birthDate, LocalDate.now()).getYears();
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
