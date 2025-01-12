package com.securityModel.repository;

import com.securityModel.models.Pointage;
import com.securityModel.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PointageRepository extends JpaRepository<Pointage, Long> {
    @Query("SELECT p FROM Pointage p WHERE p.user.username = :username AND p.checkOutTime IS NULL")
    Optional<Pointage> findLatestByUserUsernameAndCheckOutTimeIsNull(String username);

    @Query("SELECT p FROM Pointage p WHERE p.user.username = :username AND p.checkOutTime BETWEEN :startOfDay AND :endOfDay")
    Optional<Pointage> findCheckOutWithin24Hours(String username, LocalDateTime startOfDay, LocalDateTime endOfDay);

    @Query("SELECT p FROM Pointage p WHERE p.user.username = :username AND DATE(p.checkInTime) = :date")
    Optional<Pointage> findByUserUsernameAndDate(String username, LocalDate date);

    @Query("SELECT p FROM Pointage p WHERE p.user.username = :username AND p.checkOutTime IS NOT NULL ORDER BY p.checkOutTime DESC")
    Optional<Pointage> findLatestByUserUsernameAndCheckOutTimeIsNotNull(String username);

    @Query("SELECT p FROM Pointage p WHERE p.user.username = :username AND p.checkInTime BETWEEN :startOfDay AND :endOfDay")
    Optional<Pointage> findCheckInWithin24Hours(String username, LocalDateTime startOfDay, LocalDateTime endOfDay);

    Optional<Pointage> findLatestByUserUsernameAndCheckInTimeIsNull(String username);

    List<Pointage> findByUserId(Long userId);

}
