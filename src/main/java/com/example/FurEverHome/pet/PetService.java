package com.example.FurEverHome.pet;

import com.example.FurEverHome.S3.S3Service;
import com.example.FurEverHome.nominatim.GeoUtils;
import com.example.FurEverHome.nominatim.GeocodingService;
import com.example.FurEverHome.user.User;
import com.example.FurEverHome.user.UserRepository;
import com.example.FurEverHome.utils.StringUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PetService {

    private final PetRepository petRepository;

    private final UserRepository userRepository;

    private final S3Service s3Service;

    private final GeocodingService geocodingService;

    @Autowired
    public PetService(PetRepository petRepository, UserRepository userRepository, S3Service s3Service, GeocodingService geocodingService) {
        this.petRepository = petRepository;
        this.userRepository = userRepository;
        this.s3Service = s3Service;
        this.geocodingService = geocodingService;
    }
    public List<Pet> getPets() {
        return petRepository.findAll();
    }

    public List<Pet> getPetsByUser(UUID userId) {
        return petRepository.findByUserId(userId);
    }

    public List<Pet> getPetsSortedByDistance(Double userLatitude, Double userLongitude){
        List<Pet> pets = petRepository.findAll();

        return pets.stream()
                .sorted((Pet p1, Pet p2) -> {
                    double dist1 = GeoUtils.haversineDistance(userLatitude, userLongitude, p1.getLatitude(), p1.getLongitude());
                    double dist2 = GeoUtils.haversineDistance(userLatitude, userLongitude, p2.getLatitude(), p2.getLongitude());
                    return Double.compare(dist1, dist2);
                })
                .collect(Collectors.toList());
    }

    public Pet addPet(Pet pet) {
        Map<String, Double> coordinates = geocodingService.getCoordinates(pet.getOras(), pet.getJudet());
        if (coordinates != null) {
            pet.setLatitude(coordinates.get("latitude"));
            pet.setLongitude(coordinates.get("longitude"));
        }
        return petRepository.save(pet);
    }

    public void deletePet(UUID petId) {
        boolean petExists = petRepository.existsById(petId);
        if (!petExists) {
            throw new IllegalStateException("Pet with id " + petId + " does not exist");
        }
        petRepository.deleteById(petId);
    }

    @Transactional
    public void updatePet(UUID petId, String name, String petType, String breed, String description,
                          String birthDate, Integer age, String judet, String oras, String sex) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));

        if (name != null && !name.isEmpty() && !name.equals(pet.getName())) {
            pet.setName(name);
        }

        if (petType != null && !petType.isEmpty() && !petType.equals(pet.getPetType())) {
            pet.setPetType(petType);
        }

        if (breed != null && !breed.isEmpty() && !breed.equals(pet.getBreed())) {
            pet.setBreed(breed);
        }

        if (description != null && !description.isEmpty() && !description.equals(pet.getDescription())) {
            pet.setDescription(description);
        }

        if (birthDate != null && !birthDate.isEmpty()) {
            pet.setBirthDate(LocalDate.parse(birthDate));
        }

        if (age != null && age > 0 && !age.equals(pet.getAge())) {
            pet.setAge(age);
        }

        if (judet != null && !judet.isEmpty() && !judet.equals(pet.getJudet())) {
            pet.setJudet(judet);
        }

        if (oras != null && !oras.isEmpty() && !oras.equals(pet.getOras())) {
            pet.setOras(oras);
        }

        if (sex != null && !sex.isEmpty() && !sex.equals(pet.getSex())) {
            pet.setSex(sex);
        }

    }

    public void setPetUser(UUID petId, UUID userId) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("User with id " + userId + " does not exist"));
        pet.setUser(user);
        petRepository.save(pet);
    }

    public void adoptPet(UUID petId, UUID userId) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("User with id " + userId + " does not exist"));
        if(pet.getHasBeenAdopted()) {
            throw new IllegalStateException("Pet with id " + petId + " has already been adopted");
        }
        else {
            pet.setAdoptiveUser(user);
            pet.setHasBeenAdopted(true);
            petRepository.save(pet);
        }

    }

    public Pet uploadImages(UUID petId, MultipartFile[] images) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));

        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : images) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            //String Extension = Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf("."));
            String key = pet.getImageFolder() + "/" + fileName;
            String imageUrl = s3Service.uploadFile(key, file);
            imageUrls.add(imageUrl);
        }

        pet.setImageUrls(imageUrls);
        return petRepository.save(pet);
    }

    public Pet getPetById(UUID petId) {
        return petRepository.findById(petId).orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));
    }

    public List<Pet> getFilteredPets(String keyWords, String county, String city, Double userLatitude, Double userLongitude) {
        List<Pet> pets;
        System.out.println("Searching for pets with keywords: " + keyWords + ", county: " + county + ", city: " + city);
        if (keyWords == null && county == null && city == null) {
            pets =  petRepository.findAll();
        }
        else{
            pets = petRepository.findFilteredPets(StringUtils.replaceDiacritics(keyWords), StringUtils.replaceDiacritics(county), StringUtils.replaceDiacritics(city));
        }

        if(userLatitude != null && userLongitude != null) {
            return pets.stream()
                    .sorted((Pet p1, Pet p2) -> {
                        double dist1 = GeoUtils.haversineDistance(userLatitude, userLongitude, p1.getLatitude(), p1.getLongitude());
                        double dist2 = GeoUtils.haversineDistance(userLatitude, userLongitude, p2.getLatitude(), p2.getLongitude());
                        return Double.compare(dist1, dist2);
                    })
                    .collect(Collectors.toList());
        }
        return pets;
    }

    public List<Pet> getRecentThreePets() {
        List<Pet> pets = petRepository.findAll();
        return pets.stream()
                .sorted(Comparator.comparing(Pet::getDateAdded).reversed())
                .limit(3)
                .collect(Collectors.toList());
    }
}
