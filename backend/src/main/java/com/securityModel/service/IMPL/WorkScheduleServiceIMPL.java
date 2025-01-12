package com.securityModel.service.IMPL;

import com.securityModel.models.User;
import com.securityModel.models.WorkDay;
import com.securityModel.models.WorkSchedule;
import com.securityModel.repository.UserRepository;
import com.securityModel.repository.WorkDayRepository;
import com.securityModel.repository.WorkScheduleRepository;
import com.securityModel.service.WorkScheduleService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class WorkScheduleServiceIMPL implements WorkScheduleService {
    private static final Logger logger = LoggerFactory.getLogger(WorkScheduleServiceIMPL.class);

    @Autowired
    private WorkScheduleRepository workScheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkDayRepository workDayRepository;
    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public List<WorkSchedule> getAllSchedules() {
        return workScheduleRepository.findAll();
    }

    @Override
    public Optional<WorkSchedule> getScheduleById(Long id) {
        return workScheduleRepository.findById(id);
    }


    @Override
    @Transactional
    public WorkSchedule updateSchedule(Long id, WorkSchedule workScheduleDetails) {
        Optional<WorkSchedule> optionalWorkSchedule = workScheduleRepository.findById(id);
        if (optionalWorkSchedule.isPresent()) {
            WorkSchedule workSchedule = optionalWorkSchedule.get();
            workSchedule.setScheduledCheckInTime(workScheduleDetails.getScheduledCheckInTime());
            workSchedule.setScheduledCheckOutTime(workScheduleDetails.getScheduledCheckOutTime());
            workSchedule.setUser(workScheduleDetails.getUser());

            Set<WorkDay> newWorkDays = workScheduleDetails.getWorkDays();
            if (newWorkDays == null) {
                newWorkDays = new HashSet<>();
            }

            Set<WorkDay> currentWorkDays = workSchedule.getWorkDays();
            if (currentWorkDays == null) {
                currentWorkDays = new HashSet<>();
            }

            // Remove unreferenced WorkDays
            Iterator<WorkDay> iterator = currentWorkDays.iterator();
            while (iterator.hasNext()) {
                WorkDay currentWorkDay = iterator.next();
                if (!newWorkDays.contains(currentWorkDay)) {
                    iterator.remove();
                    workDayRepository.delete(currentWorkDay); // Ensure deletion from the repository
                }
            }

            // Add new WorkDays
            for (WorkDay newWorkDay : newWorkDays) {
                if (!currentWorkDays.contains(newWorkDay)) {
                    newWorkDay.setWorkSchedule(workSchedule);
                    currentWorkDays.add(newWorkDay);
                } else {
                    // Update declared attribute if WorkDay already exists
                    for (WorkDay currentWorkDay : currentWorkDays) {
                        if (currentWorkDay.equals(newWorkDay)) {
                            currentWorkDay.setDeclared(newWorkDay.isDeclared());
                            break;
                        }
                    }
                }
            }

            workSchedule.setWorkDays(currentWorkDays);

            return workScheduleRepository.save(workSchedule);
        } else {
            throw new RuntimeException("Work schedule not found");
        }
    }

    @Override
    public void deleteSchedule(Long id) {
        logger.debug("Deleting WorkSchedule with ID: {}", id);
        workScheduleRepository.deleteById(id);
    }

    @Override
    public List<WorkSchedule> getWorkSchedulesByUsername(String username) {
        return workScheduleRepository.findByUserUsername(username);
    }

    @Override
    public WorkSchedule createWorkSchedule(String username, LocalTime scheduledCheckInTime, LocalTime scheduledCheckOutTime, Set<WorkDay> workDays) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            WorkSchedule workSchedule = new WorkSchedule();
            workSchedule.setUser(user);
            workSchedule.setScheduledCheckInTime(scheduledCheckInTime);
            workSchedule.setScheduledCheckOutTime(scheduledCheckOutTime);

            WorkSchedule savedWorkSchedule = workScheduleRepository.save(workSchedule);

            for (WorkDay workDay : workDays) {
                workDay.setWorkSchedule(savedWorkSchedule);
                logger.debug("Adding new WorkDay during creation: {}", workDay);
            }
            workDayRepository.saveAll(workDays);

            savedWorkSchedule.setWorkDays(workDays);
            logger.debug("Created new WorkSchedule with ID: {} and WorkDays: {}", savedWorkSchedule.getId(), savedWorkSchedule.getWorkDays());
            return savedWorkSchedule;
        } else {
            throw new RuntimeException("Username not found");
        }
    }

}
