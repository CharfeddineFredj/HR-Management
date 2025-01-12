package com.securityModel.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate payrollDate;
    private double totalHoursWorked;
    private double totalSalary;
    private double overtimeMinutes;
    private double undertimeMinutes; // Ensure this field is properly defined
    private double totalHoursWorkedBeforeAdjustment;

    // Constructeurs, getters et setters
    public Payroll() {}

    public Payroll(User user, LocalDate payrollDate, double totalHoursWorked, double totalSalary, double overtimeMinutes, double undertimeMinutes, double totalHoursWorkedBeforeAdjustment) {
        this.user = user;
        this.payrollDate = payrollDate;
        this.totalHoursWorked = totalHoursWorked;
        this.totalSalary = totalSalary;
        this.overtimeMinutes = overtimeMinutes;
        this.undertimeMinutes = undertimeMinutes;
        this.totalHoursWorkedBeforeAdjustment = totalHoursWorkedBeforeAdjustment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDate getPayrollDate() {
        return payrollDate;
    }

    public void setPayrollDate(LocalDate payrollDate) {
        this.payrollDate = payrollDate;
    }

    public double getTotalHoursWorked() {
        return totalHoursWorked;
    }

    public void setTotalHoursWorked(double totalHoursWorked) {
        this.totalHoursWorked = totalHoursWorked;
    }

    public double getTotalSalary() {
        return totalSalary;
    }

    public void setTotalSalary(double totalSalary) {
        this.totalSalary = totalSalary;
    }

    public double getOvertimeMinutes() {
        return overtimeMinutes;
    }

    public void setOvertimeMinutes(double overtimeMinutes) {
        this.overtimeMinutes = overtimeMinutes;
    }

    public double getUndertimeMinutes() {
        return undertimeMinutes;
    }

    public void setUndertimeMinutes(double undertimeMinutes) {
        this.undertimeMinutes = undertimeMinutes;
    }

    public double getTotalHoursWorkedBeforeAdjustment() {
        return totalHoursWorkedBeforeAdjustment;
    }

    public void setTotalHoursWorkedBeforeAdjustment(double totalHoursWorkedBeforeAdjustment) {
        this.totalHoursWorkedBeforeAdjustment = totalHoursWorkedBeforeAdjustment;
    }
}
