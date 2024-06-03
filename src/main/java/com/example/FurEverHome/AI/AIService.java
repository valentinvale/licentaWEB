package com.example.FurEverHome.AI;

import com.example.FurEverHome.S3.S3Service;
import com.example.FurEverHome.pet.Pet;
import com.example.FurEverHome.pet.PetService;
import com.example.FurEverHome.user.User;
import com.example.FurEverHome.user.UserRepository;
import com.example.FurEverHome.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
public class AIService {

    @Value("${ai.apiurl}")
    private String apiUrl;
    private final S3Service s3Service;
    private final RestTemplate restTemplate;

    private final UserService userService;
    private final UserRepository userRepository;

    private final PetService petService;

    @Autowired
    public AIService(S3Service s3Service, RestTemplate restTemplate, UserService userService, PetService petService, UserRepository userRepository) {
        this.s3Service = s3Service;
        this.restTemplate = restTemplate;
        this.userService = userService;
        this.petService = petService;
        this.userRepository = userRepository;
    }

    public String generatePetName(MultipartFile image, String petType) {
        try{
            String generateNameUrl = apiUrl + "/generate-pet-name";

            String key = "ai/" + UUID.randomUUID() + "_" + image.getOriginalFilename();
            String imageUrl = s3Service.uploadFile(key, image);

            Map<String, String> request = new HashMap<>();

            request.put("imageUrl", imageUrl);
            request.put("petType", petType);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(generateNameUrl, entity, String.class);

            s3Service.deleteFile(key);

            return response.getBody();
        }
        catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, String> predictPetBreed(MultipartFile image, String petType) {
        try{
            String predictBreedUrl = apiUrl + "/predict-pet-breed";

            String key = "ai/" + UUID.randomUUID() + "_" + image.getOriginalFilename();
            String imageUrl = s3Service.uploadFile(key, image);

            Map<String, String> request = new HashMap<>();

            request.put("imageUrl", imageUrl);
            request.put("petType", petType);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(predictBreedUrl, entity, Map.class);

            s3Service.deleteFile(key);

            return response.getBody();
        }
        catch (Exception e){
            e.printStackTrace();
            return null;
        }

    }

    public Map<String, Object> predictPetCompatibility(UUID userId, UUID petId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Pet pet = petService.getPetById(petId);
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

                if (value instanceof Double) {
                    formattedResponse.put(key, value.toString());  // Convert Double to String
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

}
