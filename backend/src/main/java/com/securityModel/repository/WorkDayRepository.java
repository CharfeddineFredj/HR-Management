package com.securityModel.repository;
import com.securityModel.models.User;
import com.securityModel.models.WorkDay;

import com.securityModel.models.WorkSchedule;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface WorkDayRepository extends JpaRepository<WorkDay, Long> {
    Optional<WorkDay> findByWorkScheduleAndDayOfWeek(WorkSchedule workSchedule, DayOfWeek dayOfWeek);

    Optional<WorkDay> findByWorkScheduleUserAndDayOfWeek(User user, DayOfWeek dayOfWeek);



}



