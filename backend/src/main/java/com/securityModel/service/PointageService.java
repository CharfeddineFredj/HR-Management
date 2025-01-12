package com.securityModel.service;


import com.securityModel.models.Pointage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PointageService{


    Pointage checkIn(String username, LocalDateTime checkInTime, double latitude, double longitude);



    List<Pointage> getAllPointages(); // Add this line

    Pointage checkOut(String username, LocalDateTime checkOutTime, double latitude, double longitude);

    String editPointage(Long id, LocalDateTime checkInTime, LocalDateTime checkOutTime);


    Pointage getbyId(Long id);

    List<Pointage> getPointagesByUserId(Long userId);
}

