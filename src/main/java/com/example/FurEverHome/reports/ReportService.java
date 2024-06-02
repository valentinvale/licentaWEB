package com.example.FurEverHome.reports;

import com.example.FurEverHome.pet.Pet;
import com.example.FurEverHome.pet.PetRepository;
import com.example.FurEverHome.user.Role;
import com.example.FurEverHome.user.User;
import com.example.FurEverHome.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ReportService {


    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository, UserRepository userRepository, PetRepository petRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }

    public List<Report> getReports() {
        return reportRepository.findAll();
    }

    public List<Report> getReportsByReportedUser(UUID userId) {
        return reportRepository.findByReportedUserId(userId);
    }

    public List<Report> getReportsByReportingUser(UUID userId) {
        return reportRepository.findByReportingUserId(userId);
    }


    public Report addReport(Report report) {
        return reportRepository.save(report);
    }

    public void deleteReport(UUID reportId) {
        reportRepository.deleteById(reportId);
    }

    public void validateReport(UUID reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalStateException("Report with id " + reportId + " does not exist"));
        report.setWasCheckedByAdmin(true);
        reportRepository.save(report);
    }

    public void setReportingUser(UUID reportId, UUID userId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalStateException("Report with id " + reportId + " does not exist"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with id " + userId + " does not exist"));
        if(user.getRole() == Role.ADMIN) {
            report.setWasDoneByAdmin(true);
        }
        report.setReportingUser(user);
        reportRepository.save(report);
    }

    public void setReportedUser(UUID reportId, UUID userId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalStateException("Report with id " + reportId + " does not exist"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User with id " + userId + " does not exist"));
        report.setReportedUser(user);
        reportRepository.save(report);
    }
    public void setReportingPet(UUID reportId, UUID petId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalStateException("Report with id " + reportId + " does not exist"));
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalStateException("Pet with id " + petId + " does not exist"));
        report.setPet(pet);
        reportRepository.save(report);
    }
}
