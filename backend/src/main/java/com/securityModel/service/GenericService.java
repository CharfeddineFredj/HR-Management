package com.securityModel.service;

import com.securityModel.models.User;

import java.util.List;
import java.util.Optional;

public interface GenericService<T>{

    T create(T entity);
    List<T> getall();

    T getbyId(Long id);

    T update(T entity);

    void delete(Long id);
    Optional<User> findByUsername(String username);

}
