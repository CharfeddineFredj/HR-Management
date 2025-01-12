package com.securityModel.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
public class Administrateur extends User{

    private String firstname;

    private  String lastname;

    private String address;

    private String department;

    private String date_birth;

    private String job;

    private String hire_date;
    private double salary;
    private String id_card;

    private String phone;
    private String gender;

    private String contract_type;


    public Administrateur() {
    }

    public Administrateur(String username, String email, String password, String image, String firstname, String lastname, String address, String department, String date_birth, String job, String hire_date, double salary, String id_card, String phone, String gender, String contract_type) {
        super(username, email, password, image);
        this.firstname = firstname;
        this.lastname = lastname;
        this.address = address;
        this.department = department;
        this.date_birth = date_birth;
        this.job = job;
        this.hire_date = hire_date;
        this.salary = salary;
        this.id_card = id_card;
        this.phone = phone;
        this.gender = gender;
        this.contract_type = contract_type;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDate_birth() {
        return date_birth;
    }

    public void setDate_birth(String date_birth) {
        this.date_birth = date_birth;
    }

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public String getHire_date() {
        return hire_date;
    }

    public void setHire_date(String hire_date) {
        this.hire_date = hire_date;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public String getId_card() {
        return id_card;
    }

    public void setId_card(String id_card) {
        this.id_card = id_card;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getContract_type() {
        return contract_type;
    }

    public void setContract_type(String contract_type) {
        this.contract_type = contract_type;
    }
}
