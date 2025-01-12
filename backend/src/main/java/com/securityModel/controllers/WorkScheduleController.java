package com.securityModel.controllers;

import com.securityModel.models.User;
import com.securityModel.models.WorkDay;
import com.securityModel.models.WorkSchedule;
import com.securityModel.payload.request.WorkDayRequest;
import com.securityModel.payload.request.WorkScheduleRequest;
import com.securityModel.service.IMPL.WorkdayServiceIMPL;
import com.securityModel.service.UserService;
import com.securityModel.service.WorkDayService;
import com.securityModel.service.WorkScheduleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/workschedule")
public class WorkScheduleController {

    private static final Logger logger = LoggerFactory.getLogger(WorkScheduleController.class);
    @Autowired
    private WorkScheduleService workScheduleService;
    @Autowired
    private WorkDayService workDayService;
    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public List<WorkSchedule> getAllSchedules() {
        return workScheduleService.getAllSchedules();
    }

    @GetMapping("/getone/{id}")
    public ResponseEntity<WorkSchedule> getScheduleById(@PathVariable Long id) {
        Optional<WorkSchedule> workSchedule = workScheduleService.getScheduleById(id);
        return workSchedule.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{username}")
    public List<WorkSchedule> getWorkSchedules(@PathVariable String username) {
        return workScheduleService.getWorkSchedulesByUsername(username);
    }

    @PostMapping("/add")
    public ResponseEntity<?> createWorkSchedule(@RequestBody WorkScheduleRequest workScheduleRequest) {
        try {
            WorkSchedule workSchedule = workScheduleService.createWorkSchedule(
                    workScheduleRequest.getUsername(),
                    workScheduleRequest.getScheduledCheckInTime(),
                    workScheduleRequest.getScheduledCheckOutTime(),
                    new HashSet<>()
            );

            workDayService.saveWorkDays(workSchedule, workScheduleRequest.getWorkDays());

            return new ResponseEntity<>(workSchedule, HttpStatus.CREATED);
        } catch (RuntimeException ex) {
            if (ex.getMessage().equals("Username not found")) {
                return new ResponseEntity<>(Collections.singletonMap("message", ex.getMessage()), HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(Collections.singletonMap("message", ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody WorkScheduleRequest workScheduleRequest) {
        try {
            Optional<User> optionalUser = userService.findByUsername(workScheduleRequest.getUsername());
            if (!optionalUser.isPresent()) {
                return new ResponseEntity<>(Collections.singletonMap("message", "Username not found"), HttpStatus.NOT_FOUND);
            }

            User user = optionalUser.get();

            WorkSchedule workScheduleDetails = new WorkSchedule();
            workScheduleDetails.setId(id);
            workScheduleDetails.setScheduledCheckInTime(workScheduleRequest.getScheduledCheckInTime());
            workScheduleDetails.setScheduledCheckOutTime(workScheduleRequest.getScheduledCheckOutTime());
            workScheduleDetails.setUser(user);

            Set<WorkDay> workDays = workScheduleRequest.getWorkDays().stream().map(request -> {
                WorkDay workDay = new WorkDay();
                workDay.setDayOfWeek(request.getDayOfWeek());
                workDay.setDeclared(request.isDeclared());
                return workDay;
            }).collect(Collectors.toSet());

            workScheduleDetails.setWorkDays(workDays);

            WorkSchedule updatedWorkSchedule = workScheduleService.updateSchedule(id, workScheduleDetails);

            return new ResponseEntity<>(updatedWorkSchedule, HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace(); // Log the stack trace for debugging
            return new ResponseEntity<>(Collections.singletonMap("message", ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/delete/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        workScheduleService.deleteSchedule(id);
    }
}




