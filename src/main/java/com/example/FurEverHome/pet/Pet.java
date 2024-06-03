package com.example.FurEverHome.pet;

import com.example.FurEverHome.reports.Report;
import com.example.FurEverHome.user.User;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

    private String sex;
    @ElementCollection
    private List<String> imageUrls;

    private String imageFolder;
    private String description;
    private LocalDate dateAdded;

    private Double latitude;
    private Double longitude;
    @Nullable
    private String temperament;
    @Nullable
    private String activityLevel;
    @Nullable
    private String careNeeds;
    @Nullable
    private String noiseLevel;
    @Nullable
    private String goodWithKids;
    @Nullable
    private String goodWithPets;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private boolean hasBeenAdopted;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "adoptive_user_id", referencedColumnName = "id")
    private User adoptiveUser;

    @JsonIgnore
    @OneToMany(mappedBy = "pet")
    private Set<Report> reports = new HashSet<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "favorites")
    private Set<User> favoritedBy = new HashSet<>();

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
        updateImageFolder();
    }

    public void updateImageFolder() {
        this.imageFolder = name + "_" + UUID.randomUUID().toString();
    }

    public String getImageFolder() {
        return imageFolder;
    }

    public List<String> getImageUrls() {
        return imageUrls;
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

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex){
        this.sex = sex;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Set<Report> getReports() {
        return reports;
    }

    public void setReports(Set<Report> reports) {
        this.reports = reports;
    }

    public String getTemperament() {
        return temperament;
    }

    public void setTemperament(String temperament) {
        this.temperament = temperament;
    }

    public String getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(String activityLevel) {
        this.activityLevel = activityLevel;
    }

    public String getCareNeeds() {
        return careNeeds;
    }

    public void setCareNeeds(String careNeeds) {
        this.careNeeds = careNeeds;
    }

    public String getNoiseLevel() {
        return noiseLevel;
    }

    public void setNoiseLevel(String noiseLevel) {
        this.noiseLevel = noiseLevel;
    }

    public String getGoodWithKids() {
        return goodWithKids;
    }

    public void setGoodWithKids(String goodWithKids) {
        this.goodWithKids = goodWithKids;
    }

    public String getGoodWithPets() {
        return goodWithPets;
    }

    public void setGoodWithPets(String goodWithPets) {
        this.goodWithPets = goodWithPets;
    }

    public Set<User> getFavoritedBy() {
        return favoritedBy;
    }

    public void setFavoritedBy(Set<User> favoritedBy) {
        this.favoritedBy = favoritedBy;
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
