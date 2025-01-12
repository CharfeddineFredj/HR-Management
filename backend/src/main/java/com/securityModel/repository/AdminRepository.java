package com.securityModel.repository;

import com.securityModel.models.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Administrateur,Long> {
    Optional<Administrateur> findByUsername(String registrationNumber);
}
