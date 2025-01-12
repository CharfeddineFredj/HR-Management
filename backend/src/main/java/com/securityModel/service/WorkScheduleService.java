package com.securityModel.service;

import com.securityModel.models.WorkDay;
import com.securityModel.models.WorkSchedule;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface WorkScheduleService {

    List<WorkSchedule> getAllSchedules();
    Optional<WorkSchedule> getScheduleById(Long id);
    WorkSchedule updateSchedule(Long id, WorkSchedule workScheduleDetails);
    void deleteSchedule(Long id);
    List<WorkSchedule> getWorkSchedulesByUsername(String username);
    WorkSchedule createWorkSchedule(String username, LocalTime scheduledCheckInTime, LocalTime scheduledCheckOutTime, Set<WorkDay> workDays);
}
