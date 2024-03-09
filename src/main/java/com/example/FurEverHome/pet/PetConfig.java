//package com.example.FurEverHome.pet;
//
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.UUID;
//
//@Configuration
//public class PetConfig {
//    @Bean
//    CommandLineRunner commandLineRunner(PetRepository repository) {
//        return args -> {
//            Pet pisi = new Pet("pisi", "cat", "siamese", "2020-02-09", "cute", "Bucuresti", "Bucuresti");
//            Pet mimi = new Pet("mimi", "cat", "siamese", "2020-02-09", "cute", "Mehedinti", "Drobeta Turnu Severin");
//
//            repository.saveAll(List.of(pisi, mimi));
//        };
//    }
//}
