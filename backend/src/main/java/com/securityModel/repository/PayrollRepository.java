package com.securityModel.repository;

import com.securityModel.models.Payroll;
import com.securityModel.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByUser(User user);

    Optional<Payroll> findByUserAndPayrollDate(User user, LocalDate payrollDate);

    List<Payroll> findByPayrollDateBetween(LocalDate startDate, LocalDate endDate);

}
