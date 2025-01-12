package com.securityModel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.securityModel.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);
  // In UserRepository.java



  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);


  Optional<User> findByUsernameOrEmail(String username, String email);

  User findByEmail(String email);
  User findFirstByEmail (String email);
  User findByPasswordResetToken(String passwordResetToken);
}
