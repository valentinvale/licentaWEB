package com.example.FurEverHome.pet;

import com.example.FurEverHome.AI.AIService;
import com.example.FurEverHome.S3.S3Service;
import com.example.FurEverHome.nominatim.GeoUtils;
import com.example.FurEverHome.nominatim.GeocodingService;
import com.example.FurEverHome.user.User;
import com.example.FurEverHome.user.UserRepository;
import com.example.FurEverHome.utils.StringUtils;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.compare.ObjectToStringComparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PetService {

    private final PetRepository petRepository;

    private final UserRepository userRepository;

    private final S3Service s3Service;

    @Value("${ai.apiurl}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    private final GeocodingService geocodingService;
    @Autowired
    public PetService(PetRepository petRepository, UserRepository userRepository, S3Service s3Service, GeocodingService geocodingService, RestTemplate restTemplate) {
        this.petRepository = petRepository;
        this.userRepository = userRepository;
        this.s3Service = s3Service;
        this.geocodingService = geocodingService;
        this.restTemplate = restTemplate;
    }
    public List<Pet> getPets() {
        return petRepository.findAll().stream()
                .filter(pet -> !pet.getHasBeenAdopted())
                .collect(Collectors.toList());
    }

    public List<Pet> getPetsByUser(UUID userId) {
        return petRepository.findByUserId(userId);
    }

    public List<Pet> getPetsSortedByDistance(Double userLatitude, Double userLongitude){
        List<Pet> pets = petRepository.findAll();
        pets = pets.stream()
                .filter(pet -> !pet.getHasBeenAdopted())
                .collect(Collectors.toList());

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

    @Transactional
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
                    .filter(pet -> !pet.getHasBeenAdopted())
                    .collect(Collectors.toList());
        }
        return pets;
    }

    public List<Pet> getRecentThreePets() {
        List<Pet> pets = petRepository.findAll();
        return pets.stream()
                .filter(pet -> !pet.getHasBeenAdopted())
                .sorted(Comparator.comparing(Pet::getDateAdded).reversed())
                .limit(3)
                .collect(Collectors.toList());
    }

    public List<Pet> getPetsByAdoptiveUser(UUID userId) {
        return petRepository.findAll().stream()
                .filter(pet -> pet.getAdoptiveUser() != null && pet.getAdoptiveUser().getId().equals(userId))
                .collect(Collectors.toList());
    }

    public Map<String, Object> predictPetCompatibility(UUID userId, UUID petId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));
        String species;

        if (Objects.equals(pet.getPetType(), "Pisica"))
            species = "Cat";
        else
            species = "Dog";

        try {
            String predictCompatibilityUrl = apiUrl + "/predict-compatibility";

            Map<String, Object> request = new HashMap<>();
            request.put("personality", user.getPersonality().toString());
            request.put("activity_level", user.getActivityLevel().toString());
            request.put("work_schedule", user.getWorkSchedule().toString());
            request.put("living_environment", user.getLivingEnvironment().toString());
            request.put("has_children", user.getHasChildren().toString());
            request.put("has_other_pets", user.getHasOtherPets().toString());
            request.put("hypoallergenic", user.getHypoallergenic().toString());
            request.put("low_maintenance", user.getLowMaintenance().toString());

            request.put("pet_species", species);
            request.put("pet_breed", pet.getBreed());
            request.put("pet_temperament", pet.getTemperament());
            request.put("pet_activity_level", pet.getActivityLevel());
            request.put("pet_care_needs", pet.getCareNeeds());
            request.put("pet_noise_level", pet.getNoiseLevel());
            request.put("pet_good_with_kids", pet.getGoodWithKids());
            request.put("pet_good_with_pets", pet.getGoodWithPets());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(predictCompatibilityUrl, entity, Map.class);

            // Convert the response to the correct types
            Map<String, Object> responseBody = response.getBody();
            Map<String, Object> formattedResponse = new HashMap<>();

            for (Map.Entry<String, Object> entry : responseBody.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();

                if (key.equals("compatibility_percentage") && value instanceof String) {
                    formattedResponse.put(key, Double.parseDouble((String) value));  // Convert String to Double
                } else {
                    formattedResponse.put(key, value);
                }
            }

            return formattedResponse;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Pet> getPetsSortedByCompatibility(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("User with id " + userId + " does not exist"));
        List<Pet> pets = petRepository.findAll().stream()
                .filter(pet -> !pet.getHasBeenAdopted())
                .collect(Collectors.toList());

        return pets.stream()
                .sorted((Pet p1, Pet p2) -> {
                    Map<String, Object> compatibility1 = predictPetCompatibility(userId, p1.getId());
                    Map<String, Object> compatibility2 = predictPetCompatibility(userId, p2.getId());
                    double compatibilityPercentage1 = (Double) compatibility1.get("compatibility_percentage");
                    double compatibilityPercentage2 = (Double) compatibility2.get("compatibility_percentage");
                    return Double.compare(compatibilityPercentage2, compatibilityPercentage1);
                })
                .collect(Collectors.toList());
    }

}
