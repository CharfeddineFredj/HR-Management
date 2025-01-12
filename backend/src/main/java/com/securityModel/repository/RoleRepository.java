package com.securityModel.repository;

import java.util.Optional;

import com.securityModel.models.ERole;
import com.securityModel.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.securityModel.models.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(ERole name);

  Role save(Role role);


}
