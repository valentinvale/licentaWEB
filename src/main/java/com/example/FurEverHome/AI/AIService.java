package com.example.FurEverHome.AI;

import com.example.FurEverHome.S3.S3Service;
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
import java.util.UUID;

@Service
public class AIService {

    @Value("${ai.apiurl}")
    private String apiUrl;
    private final S3Service s3Service;
    private final RestTemplate restTemplate;

    @Autowired
    public AIService(S3Service s3Service, RestTemplate restTemplate) {
        this.s3Service = s3Service;
        this.restTemplate = restTemplate;
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
}
