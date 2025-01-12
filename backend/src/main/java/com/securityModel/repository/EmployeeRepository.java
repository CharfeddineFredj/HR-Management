package com.securityModel.repository;

import com.securityModel.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    @Query("SELECT e.gender, COUNT(e) FROM Employee e GROUP BY e.gender")
    List<Object[]> countEmployeesByGender();

    @Query("SELECT e.contract_type, COUNT(e) FROM Employee e GROUP BY e.contract_type")
    List<Object[]> countEmployeesByContractType();
    @Query("SELECT SUBSTRING(e.hire_date, 1, 4), COUNT(e) FROM Employee e GROUP BY SUBSTRING(e.hire_date, 1, 4)")
    List<Object[]> countEmployeesByYear();
    @Query("SELECT e.status, COUNT(e) FROM Employee e GROUP BY e.status")
    List<Object[]> countEmployeesByStatus();


    Optional<Employee> findByUsername(String registrationNumber);
}
