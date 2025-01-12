package com.securityModel.models;

import jakarta.persistence.*;


@Entity
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstname;
    private String subject_ref;
    private String lastname;
    private String date_birth;
    private String email;
    private String phone;
    private String cv;
    private String coverletter;
    private String level;
    private String diplomatitle;
    private String university;
    private int yearsexperience;
    private String status;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String experiences;

    public Candidate() {
    }

    public Candidate(String firstname, String subject_ref, String lastname, String date_birth, String email, String phone, String cv, String coverletter, String level, String diplomatitle, String university, int yearsexperience, String status, String experiences) {
        this.firstname = firstname;
        this.subject_ref = subject_ref;
        this.lastname = lastname;
        this.date_birth = date_birth;
        this.email = email;
        this.phone = phone;
        this.cv = cv;
        this.coverletter = coverletter;
        this.level = level;
        this.diplomatitle = diplomatitle;
        this.university = university;
        this.yearsexperience = yearsexperience;
        this.status = status;
        this.experiences = experiences;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getDate_birth() {
        return date_birth;
    }

    public void setDate_birth(String date_birth) {
        this.date_birth = date_birth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCv() {
        return cv;
    }

    public void setCv(String cv) {
        this.cv = cv;
    }

    public String getCoverletter() {
        return coverletter;
    }

    public void setCoverletter(String coverletter) {
        this.coverletter = coverletter;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDiplomatitle() {
        return diplomatitle;
    }

    public void setDiplomatitle(String diplomatitle) {
        this.diplomatitle = diplomatitle;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public int getYearsexperience() {
        return yearsexperience;
    }

    public void setYearsexperience(int yearsexperience) {
        this.yearsexperience = yearsexperience;
    }

    public String getExperiences() {
        return experiences;
    }

    public void setExperiences(String experiences) {
        this.experiences = experiences;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSubject_ref() {
        return subject_ref;
    }

    public void setSubject_ref(String subject_ref) {
        this.subject_ref = subject_ref;
    }
}






















