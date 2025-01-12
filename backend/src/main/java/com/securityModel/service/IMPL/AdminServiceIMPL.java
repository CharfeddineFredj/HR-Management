package com.securityModel.service.IMPL;
import com.securityModel.repository.AdminRepository;

import com.securityModel.models.Administrateur;
import com.securityModel.models.User;

import com.securityModel.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceIMPL implements AdminService {


   @Autowired
   private AdminRepository adminRepository;
    @Override
    public Administrateur create(Administrateur entity) {
       return adminRepository.save(entity);

    }
    @Override
    public List<Administrateur> getall() {
        return adminRepository.findAll();
    }
    @Override
    public Administrateur getbyId(Long id) {
        return adminRepository.findById(id).orElseThrow(()->new RuntimeException("id not found"));
    }
    public boolean existsById(Long id) {
        return adminRepository.existsById(id);
    }
    @Override
    public Administrateur update(Administrateur entity) {
        return adminRepository.save(entity);
    }

    @Override
    public void delete(Long id) {
        adminRepository.deleteById(id);

    }

    @Override
    public Optional<User> findByUsername(String username) {
        return Optional.empty();
    }
}
