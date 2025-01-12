package com.securityModel.service;

import com.securityModel.models.Vaction;

import java.util.List;
import java.util.Optional;

public interface VactionService {
    List<Vaction> getAllVactions();



    Vaction createVaction(Vaction vaction);



    void deleteVaction(Long id);

    Vaction approveVaction(Long id);

    Vaction rejectVaction(Long id);




    List<Vaction> getVacationsByRegistrationNumber(String registrationNumber);

    int calculateSpentDays(String registrationNumber, int year);

    int calculateRemainingDays(String registrationNumber, int year);

    List<Integer> getAvailableYears();

    Vaction getVactionById(Long id);
}
