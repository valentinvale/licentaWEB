package com.example.FurEverHome.AI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping(path = "api/v1/ai")
public class AIController {

    private final AIService aiService;

    @Autowired
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate-pet-name")
    public String generatePetName(MultipartFile image, String petType) {
        return aiService.generatePetName(image, petType);
    }

    @PostMapping("/predict-pet-breed")
    public Map<String, String> predictPetBreed(MultipartFile image, String petType) {
        return aiService.predictPetBreed(image, petType);
    }

}
