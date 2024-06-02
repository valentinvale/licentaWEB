package com.example.FurEverHome.reports;

import com.example.FurEverHome.pet.Pet;
import com.example.FurEverHome.user.Role;
import com.example.FurEverHome.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "report")
public class Report {
    @Id
    @GeneratedValue(generator = "uuid2", strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "reported_user_id", referencedColumnName = "id")
    private User reportedUser;

    @ManyToOne
    @JoinColumn(name = "reporting_user_id", referencedColumnName = "id")
    private User reportingUser;

    @ManyToOne
    @JoinColumn(name = "pet_id", referencedColumnName = "id")
    private Pet pet;

    private String description;
    private LocalDate dateAdded;
    private boolean wasCheckedByAdmin;
    private boolean wasDoneByAdmin;

    public Report() {
        this.dateAdded = LocalDate.now();
        this.wasCheckedByAdmin = false;
        this.wasDoneByAdmin = false;
    }

    public Report(UUID reportingUserId, UUID reportedUserId, UUID petId, String description) {
        this.dateAdded = LocalDate.now();
        this.wasCheckedByAdmin = false;
        this.wasDoneByAdmin = false;
    }

    @PrePersist
    public void checkIfAdmin() {
        if (reportingUser != null && reportingUser.getRole().equals(Role.ADMIN)) {
            this.wasDoneByAdmin = true;
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getReportedUser() {
        return reportedUser;
    }

    public void setReportedUser(User reportedUser) {
        this.reportedUser = reportedUser;
    }

    public User getReportingUser() {
        return reportingUser;
    }

    public void setReportingUser(User reportingUser) {
        this.reportingUser = reportingUser;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(LocalDate dateAdded) {
        this.dateAdded = dateAdded;
    }

    public boolean isWasCheckedByAdmin() {
        return wasCheckedByAdmin;
    }

    public void setWasCheckedByAdmin(boolean wasCheckedByAdmin) {
        this.wasCheckedByAdmin = wasCheckedByAdmin;
    }

    public boolean isWasDoneByAdmin() {
        return wasDoneByAdmin;
    }

    public void setWasDoneByAdmin(boolean wasDoneByAdmin) {
        this.wasDoneByAdmin = wasDoneByAdmin;
    }
}
