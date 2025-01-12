package com.securityModel.service;

import com.securityModel.models.Employee;
import com.securityModel.payload.request.UpdateEmployeeRequest;

import java.util.Map;

public interface EmployeeService extends GenericService<Employee> {
    Employee updateEmployeeDetails(Long id, UpdateEmployeeRequest updateRequest);
    boolean existsById(Long id);

    Employee getById(Long id);


    Map<Integer, Long> getEmployeeCountByYear();


    Map<String, Long> getEmployeeCountByStatus();

    Map<String, Long> getEmployeeCountByGender();

    Map<String, Long> getEmployeeCountByContractType();


}
