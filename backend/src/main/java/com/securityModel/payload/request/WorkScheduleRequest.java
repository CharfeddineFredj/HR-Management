package com.securityModel.payload.request;

import java.time.LocalTime;
import java.time.DayOfWeek;
import java.util.List;
import java.util.Set;

public class WorkScheduleRequest {
    private String username;
    private LocalTime scheduledCheckInTime;
    private LocalTime scheduledCheckOutTime;
    private Set<WorkDayRequest> workDays;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Set<WorkDayRequest> getWorkDays() {
        return workDays;
    }

    public void setWorkDays(Set<WorkDayRequest> workDays) {
        this.workDays = workDays;
    }



}

