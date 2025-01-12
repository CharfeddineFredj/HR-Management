package com.securityModel.service;

import com.securityModel.models.Administrateur;

public interface AdminService extends GenericService<Administrateur> {
    boolean existsById(Long id);
}
