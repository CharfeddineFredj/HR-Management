package com.securityModel.service.IMPL;

import com.securityModel.models.User;
import com.securityModel.repository.UserRepository;
import com.securityModel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceIMPL implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public User create(User entity) {
        return userRepository.save(entity);
    }

    @Override
    public List<User> getall() {
        return userRepository.findAll();
    }

    @Override
    public User getbyId(Long id) {
        return userRepository.findById(id).orElseThrow(()->new RuntimeException("id not found"));
    }

    @Override
    public User update(User entity) {
        return userRepository.save(entity);
    }


    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);

    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
