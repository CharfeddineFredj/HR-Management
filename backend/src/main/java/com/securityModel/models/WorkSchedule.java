package com.securityModel.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.Set;

@Entity
public class WorkSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalTime scheduledCheckInTime;
    private LocalTime scheduledCheckOutTime;

    @OneToMany(mappedBy = "workSchedule", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<WorkDay> workDays;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalTime getScheduledCheckInTime() {
        return scheduledCheckInTime;
    }

    public void setScheduledCheckInTime(LocalTime scheduledCheckInTime) {
        this.scheduledCheckInTime = scheduledCheckInTime;
    }

    public LocalTime getScheduledCheckOutTime() {
        return scheduledCheckOutTime;
    }

    public void setScheduledCheckOutTime(LocalTime scheduledCheckOutTime) {
        this.scheduledCheckOutTime = scheduledCheckOutTime;
    }

    public Set<WorkDay> getWorkDays() {
        return workDays;
    }

    public void setWorkDays(Set<WorkDay> workDays) {
        this.workDays = workDays;
    }
}
