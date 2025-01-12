package com.securityModel.service.IMPL;

import com.securityModel.exception.AlreadyCheckedInException;
import com.securityModel.exception.NoCheckInFoundException;
import com.securityModel.models.Pointage;
import com.securityModel.models.User;
import com.securityModel.models.WorkDay;
import com.securityModel.models.WorkSchedule;
import com.securityModel.repository.PointageRepository;
import com.securityModel.repository.UserRepository;
import com.securityModel.repository.WorkScheduleRepository;
import com.securityModel.service.PointageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PointageServiceIMPL implements PointageService{

    @Autowired
    private PointageRepository pointageRepository;

    @Autowired
    private WorkScheduleRepository workScheduleRepository;

    @Autowired
    private UserRepository userRepository;

    public Pointage checkIn(String username, LocalDateTime checkInTime, double latitude, double longitude) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new NoCheckInFoundException("User not found"));

        // Check if the check-in day is a valid work day for the user
        DayOfWeek checkInDay = checkInTime.getDayOfWeek();
        List<WorkSchedule> workSchedules = workScheduleRepository.findByUserUsername(username);
        if (workSchedules.isEmpty() || !isWorkDayValid(workSchedules.get(0).getWorkDays(), checkInDay)) {
            throw new IllegalStateException("Check-in day is not a valid work day for the user.");
        }

        // Check if there is already a check-in within the last 24 hours
        LocalDateTime startOfDay = checkInTime.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);
        Optional<Pointage> recentCheckIn = pointageRepository.findCheckInWithin24Hours(username, startOfDay, endOfDay);
        if (recentCheckIn.isPresent()) {
            throw new AlreadyCheckedInException("Cannot check in more than once within 24 hours.");
        }

        // Find the latest pointage record without a check-in time (in case check-out was done before check-in)
        Optional<Pointage> optionalPointage = pointageRepository.findLatestByUserUsernameAndCheckInTimeIsNull(username);

        Pointage pointage;
        if (optionalPointage.isPresent()) {
            pointage = optionalPointage.get();
        } else {
            // Always create a new Pointage for the first check-in of the day
            pointage = new Pointage();
        }

        pointage.setUser(user);
        pointage.setCheckInTime(checkInTime);
        pointage.setLatitude(latitude);
        pointage.setLongitude(longitude);

        // Retrieve the work schedule for this user (for simplicity, assume there is one)
        WorkSchedule workSchedule = workSchedules.get(0); // Take the first for simplicity
        pointage.setWorkSchedule(workSchedule);
        updateCompletionStatus(pointage, workSchedule);

        return pointageRepository.save(pointage);
    }

    public Pointage checkOut(String username, LocalDateTime checkOutTime, double latitude, double longitude) {
        // Check if the check-out day is a valid work day for the user
        DayOfWeek checkOutDay = checkOutTime.getDayOfWeek();
        List<WorkSchedule> workSchedules = workScheduleRepository.findByUserUsername(username);
        if (workSchedules.isEmpty() || !isWorkDayValid(workSchedules.get(0).getWorkDays(), checkOutDay)) {
            throw new IllegalStateException("Check-out day is not a valid work day for the user.");
        }

        LocalDateTime startOfDay = checkOutTime.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);

        Optional<Pointage> recentCheckOut = pointageRepository.findCheckOutWithin24Hours(username, startOfDay, endOfDay);
        if (recentCheckOut.isPresent()) {
            throw new IllegalStateException("Cannot check out more than once within 24 hours.");
        }

        // Attempt to find the latest pointage record without a check-out time
        Optional<Pointage> optionalPointage = pointageRepository.findLatestByUserUsernameAndCheckOutTimeIsNull(username);

        Pointage pointage;
        if (optionalPointage.isPresent()) {
            pointage = optionalPointage.get();
        } else {
            // If no valid check-in is found, create a new Pointage
            pointage = new Pointage();
            pointage.setUser(userRepository.findByUsername(username).orElseThrow(() -> new NoCheckInFoundException("User not found")));

            // Ensure the work schedule is set
            if (!workSchedules.isEmpty()) {
                WorkSchedule workSchedule = workSchedules.get(0); // Take the first for simplicity
                pointage.setWorkSchedule(workSchedule);
            } else {
                throw new IllegalStateException("No work schedule found for the user.");
            }
        }

        pointage.setCheckOutTime(checkOutTime);
        pointage.setLatitude(latitude);
        pointage.setLongitude(longitude);

        WorkSchedule workSchedule = pointage.getWorkSchedule();
        if (workSchedule != null) {
            updateCompletionStatus(pointage, workSchedule);
        }

        return pointageRepository.save(pointage);
    }

    private boolean isWorkDayValid(Set<WorkDay> workDays, DayOfWeek dayToCheck) {
        Set<DayOfWeek> dayOfWeeks = workDays.stream().map(WorkDay::getDayOfWeek).collect(Collectors.toSet());
        return dayOfWeeks.contains(dayToCheck);
    }

    private void updateCompletionStatus(Pointage pointage, WorkSchedule workSchedule) {
        LocalTime scheduledCheckInTime = workSchedule.getScheduledCheckInTime();
        LocalTime scheduledCheckOutTime = workSchedule.getScheduledCheckOutTime();
        LocalTime actualCheckInTime = pointage.getCheckInTime() != null ? pointage.getCheckInTime().toLocalTime() : null;
        LocalTime actualCheckOutTime = pointage.getCheckOutTime() != null ? pointage.getCheckOutTime().toLocalTime() : null;

        boolean isCompleted = false;

        if (actualCheckInTime != null && actualCheckOutTime != null) {
            isCompleted = (actualCheckInTime.isBefore(scheduledCheckInTime) || actualCheckInTime.equals(scheduledCheckInTime)) &&
                    (actualCheckOutTime.isAfter(scheduledCheckOutTime) || actualCheckOutTime.equals(scheduledCheckOutTime));
        }

        pointage.setCompleted(isCompleted);
    }

    @Override
    public List<Pointage> getAllPointages() {
        return pointageRepository.findAll();
    }

    public String editPointage(Long pointageId, LocalDateTime checkInTime, LocalDateTime checkOutTime) {
        Optional<Pointage> optionalPointage = pointageRepository.findById(pointageId);

        if (optionalPointage.isPresent()) {
            Pointage pointage = optionalPointage.get();
            WorkSchedule workSchedule = pointage.getWorkSchedule();

            // Check if the pointage already has a check-in or check-out time
            if (checkInTime != null && pointage.getCheckInTime() != null) {
                return "Cannot edit pointage: check-in time is already set.";
            }

            if (checkOutTime != null && pointage.getCheckOutTime() != null) {
                return "Cannot edit pointage: check-out time is already set.";
            }

            if (checkInTime != null) {
                pointage.setCheckInTime(checkInTime);
                pointage.setCompleted(false); // Reset completion status if only check-in time is set
            } else if (checkOutTime != null) {
                pointage.setCheckOutTime(checkOutTime);
            }

            updateCompletionStatus(pointage, workSchedule);
            pointageRepository.save(pointage);
            return "Pointage updated successfully.";
        } else {
            return "Pointage not found.";
        }
    }

    public Pointage getbyId(Long id) {
        return pointageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pointage not found with id: " + id));
    }

    @Override
    public List<Pointage> getPointagesByUserId(Long userId) {
        return pointageRepository.findByUserId(userId);
    }


}
