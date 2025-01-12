package com.securityModel.repository;

import com.securityModel.models.Vaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VactionRepository extends JpaRepository<Vaction, Long> {
    List<Vaction> findByRegistrationNumber(String registrationNumber);

    @Query("SELECT v FROM Vaction v WHERE v.registrationNumber = :registrationNumber AND YEAR(v.start_date) = :year AND v.status = 'approved'")
    List<Vaction> findApprovedVacationsByRegistrationNumberAndYear(String registrationNumber, int year);

    @Query("SELECT DISTINCT YEAR(v.start_date) FROM Vaction v ORDER BY YEAR(v.start_date) DESC")
    List<Integer> findDistinctYears();
}
