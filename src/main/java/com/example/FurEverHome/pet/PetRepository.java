package com.example.FurEverHome.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PetRepository extends JpaRepository<Pet, UUID> {

    List<Pet> findByUserId(UUID userId);

    @Query("SELECT p FROM Pet p " +
            "JOIN p.user u " +
            "WHERE (:keyWords IS NULL OR " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyWords, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyWords, '%')) OR " +
            "LOWER(p.breed) LIKE LOWER(CONCAT('%', :keyWords, '%')) OR " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyWords, '%'))) AND " +
            "(:county IS NULL OR :county = '' OR LOWER(p.judet) = LOWER(:county)) AND " +
            "(:city IS NULL OR :city = '' OR LOWER(p.oras) = LOWER(:city))")
    List<Pet> findFilteredPets(@Param("keyWords") String keyWords,
                               @Param("county") String county,
                               @Param("city") String city);

}
