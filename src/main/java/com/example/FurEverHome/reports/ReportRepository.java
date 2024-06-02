package com.example.FurEverHome.reports;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByReportedUserId(UUID userId);

    List<Report> findByReportingUserId(UUID userId);
}
