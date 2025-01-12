package com.securityModel.service.IMPL;

import com.securityModel.models.User;
import com.securityModel.models.WorkDay;

import com.securityModel.models.WorkSchedule;
import com.securityModel.payload.request.WorkDayRequest;
import com.securityModel.repository.WorkDayRepository;
import com.securityModel.service.WorkDayService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class WorkdayServiceIMPL implements WorkDayService {
    private static final Logger logger = LoggerFactory.getLogger(WorkdayServiceIMPL.class);

    @Autowired
    private WorkDayRepository workDayRepository;

    @Override
    @Transactional
    public void saveWorkDays(WorkSchedule workSchedule, Set<WorkDayRequest> workDayRequests) {
        Set<WorkDay> workDaySet = workDayRequests.stream().map(request -> {
            WorkDay workDay = new WorkDay();
            workDay.setWorkSchedule(workSchedule);
            workDay.setDayOfWeek(request.getDayOfWeek());
            workDay.setDeclared(request.isDeclared());
            return workDay;
        }).collect(Collectors.toSet());

        workDayRepository.saveAll(workDaySet);
    }
}
