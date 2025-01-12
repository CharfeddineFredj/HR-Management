package com.securityModel.service;

import com.securityModel.models.WorkSchedule;
import com.securityModel.payload.request.WorkDayRequest;

import java.time.DayOfWeek;
import java.util.Set;

public interface WorkDayService {

    void saveWorkDays(WorkSchedule workSchedule, Set<WorkDayRequest> workDayRequests);

}
