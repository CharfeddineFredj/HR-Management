package com.securityModel.controllers;

import com.securityModel.models.Role;
import com.securityModel.models.User;
import com.securityModel.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/roles")
public class RoleController {
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/all")
    public List<Role> showRoles() {
        return roleRepository.findAll();
    }



}
