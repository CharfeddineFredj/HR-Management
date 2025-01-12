package com.securityModel.repository;

import com.securityModel.models.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface HolidayRespository extends JpaRepository<Holiday, Long> {
    Optional<Holiday> findByDate(LocalDate date);
}
