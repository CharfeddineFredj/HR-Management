package com.securityModel.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
public class Vaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at;

    @NotNull
    private Integer period;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Temporal(TemporalType.DATE)
    private Date start_date;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Temporal(TemporalType.DATE)
    private Date end_date;

    @NotNull
    private String type_vacation;
    private String status = "pending";
    private Integer days_vaction = 24;
    private Integer spent_days_vaction;
    private Integer remaining_days_vaction = 24;
    private String registrationNumber;
    @Transient
    private String imageUrl; // This field will not be persisted
    private String medicalCertificate; // New field for medical certificate

    public Vaction() {
    }

    public Vaction(Date created_at, Integer period, Date start_date, Date end_date, String type_vacation, String status, Integer days_vaction, Integer spent_days_vaction, Integer remaining_days_vaction, String registrationNumber, String medicalCertificate) {
        this.created_at = created_at;
        this.period = period;
        this.start_date = start_date;
        this.end_date = end_date;
        this.type_vacation = type_vacation;
        this.status = status;
        this.days_vaction = days_vaction;
        this.spent_days_vaction = spent_days_vaction;
        this.remaining_days_vaction = remaining_days_vaction;
        this.registrationNumber = registrationNumber;
        this.medicalCertificate = medicalCertificate;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Integer getPeriod() {
        return period;
    }

    public void setPeriod(Integer period) {
        this.period = period;
    }

    public Date getStart_date() {
        return start_date;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public Date getEnd_date() {
        return end_date;
    }

    public void setEnd_date(Date end_date) {
        this.end_date = end_date;
    }

    public String getType_vacation() {
        return type_vacation;
    }

    public void setType_vacation(String type_vacation) {
        this.type_vacation = type_vacation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getDays_vaction() {
        return days_vaction;
    }

    public void setDays_vaction(Integer days_vaction) {
        this.days_vaction = days_vaction;
    }

    public Integer getSpent_days_vaction() {
        return spent_days_vaction;
    }

    public void setSpent_days_vaction(Integer spent_days_vaction) {
        this.spent_days_vaction = spent_days_vaction;
    }

    public Integer getRemaining_days_vaction() {
        return remaining_days_vaction;
    }

    public void setRemaining_days_vaction(Integer remaining_days_vaction) {
        this.remaining_days_vaction = remaining_days_vaction;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getMedicalCertificate() {
        return medicalCertificate;
    }

    public void setMedicalCertificate(String medicalCertificate) {
        this.medicalCertificate = medicalCertificate;
    }
}
