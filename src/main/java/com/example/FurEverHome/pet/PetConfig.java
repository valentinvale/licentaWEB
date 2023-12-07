package com.example.FurEverHome.pet;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Configuration
public class PetConfig {
    @Bean
    CommandLineRunner commandLineRunner(PetRepository repository) {
        return args -> {
            Pet pisi = new Pet(UUID.randomUUID(), "pisi", "cat", "siamese", LocalDate.of(2017, 1, 1), "cute");
            Pet mimi = new Pet(UUID.randomUUID(), "mimi", "cat", "siamese", LocalDate.of(2019, 1, 1), "cute");

            repository.saveAll(List.of(pisi, mimi));
        };
    }
}
