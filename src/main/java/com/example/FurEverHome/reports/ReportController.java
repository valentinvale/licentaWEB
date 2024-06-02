package com.example.FurEverHome.reports;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/report")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/get")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public List<Report> getReports() {
        return reportService.getReports();
    }

    @GetMapping("/getbyreporteduser/{userId}")
    public List<Report> getReportsByReportedUser(@PathVariable("userId") UUID userId) {
        return reportService.getReportsByReportedUser(userId);
    }

    @GetMapping("/getbyreportinguser/{userId}")
    public List<Report> getReportsByReportingUser(@PathVariable("userId") UUID userId) {
        return reportService.getReportsByReportingUser(userId);
    }

    @PostMapping("/add")
    public Report createReport(
            @RequestBody Report report) {
        return reportService.addReport(report);
    }

    @PutMapping("/setreportinguser/{reportId}/{userId}")
    public void setReportingUser(@PathVariable UUID reportId, @PathVariable UUID userId) {
        reportService.setReportingUser(reportId, userId);
    }

    @PutMapping("/setreporteduser/{reportId}/{userId}")
    public void setReportedUser(@PathVariable UUID reportId, @PathVariable UUID userId) {
        reportService.setReportedUser(reportId, userId);
    }

    @PutMapping("/setreportingpet/{reportId}/{petId}")
    public void setReportingPet(@PathVariable UUID reportId, @PathVariable UUID petId) {
        reportService.setReportingPet(reportId, petId);
    }

    @PutMapping("/validate/{reportId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public void validateReport(@PathVariable UUID reportId) {
        reportService.validateReport(reportId);
    }

    @DeleteMapping("/delete/{reportId}/{reportingUserId}")
    @PreAuthorize("#reportingUserId == authentication.principal.id or hasAnyRole('ADMIN')")
    public void deleteReport(@PathVariable UUID reportId, @PathVariable String reportingUserId) {
        reportService.deleteReport(reportId);
    }

}
