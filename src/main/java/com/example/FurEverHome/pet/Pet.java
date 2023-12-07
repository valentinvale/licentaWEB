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
    @Transient
    private Integer age;
    private String description;

    public Pet() {
        this.id = UUID.randomUUID();
    }

    public Pet(UUID id, String name, String petType, String breed, LocalDate birthDate, String description) {
        this.id = id;
        this.name = name;
        this.petType = petType;
        this.breed = breed;
        this.birthDate = birthDate;
        this.description = description;
    }

    public Pet(String name, String petType, String breed, LocalDate birthDate, Integer age, String description) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.petType = petType;
        this.breed = breed;
        this.birthDate = birthDate;
        this.description = description;
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

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Pet{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", petType='" + petType + '\'' +
                ", breed='" + breed + '\'' +
                ", age=" + age +
                ", description='" + description + '\'' +
                '}';
    }
}
