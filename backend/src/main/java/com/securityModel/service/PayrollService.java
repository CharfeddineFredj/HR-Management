package com.securityModel.service;

import com.securityModel.models.Payroll;
import com.securityModel.models.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

public interface PayrollService {
    Payroll calculatePayroll(User user, LocalDate payrollDate);
    List<Payroll> getPayrollsByUser(User user);



    List<Payroll> getPayrollsByYear(int payrollYear);

    void calculatePayrollForAllEmployees(LocalDate payrollDate);

    List<Payroll> getPayrollsByUserAndMonth(User user, YearMonth yearMonth);


    List<Payroll> getPayrollsByMonth(YearMonth yearMonth);


    Payroll getPayrollById(Long id);

    void sendPayslipNotification(MultipartFile file, String username);

    Resource loadFile(String fileName);
}
