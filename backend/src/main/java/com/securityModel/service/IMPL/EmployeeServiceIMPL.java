package com.securityModel.service.IMPL;

import com.securityModel.models.Employee;
import com.securityModel.models.User;
import com.securityModel.payload.request.UpdateEmployeeRequest;
import com.securityModel.repository.EmployeeRepository;
import com.securityModel.repository.RoleRepository;
import com.securityModel.service.EmployeeService;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EmployeeServiceIMPL implements EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private RoleRepository roleRepository;
    @Override
    public Employee create(Employee entity) {
        return employeeRepository.save(entity);
    }

    @Override
    public List<Employee> getall() {
        return employeeRepository.findAll();
    }

    public Employee getbyId(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id " + id));
        // Initialize roles to avoid LazyInitializationException
        Hibernate.initialize(employee.getRoles());
        return employee;
    }

    @Override
    public Employee update(Employee entity) {
        return employeeRepository.save(entity);
    }

    @Override
    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return Optional.empty();
    }


    @Override
    public Employee updateEmployeeDetails(Long id, UpdateEmployeeRequest updateRequest) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Update properties if they are not null
        Optional.ofNullable(updateRequest.getFirstname()).ifPresent(existingEmployee::setFirstname);
        Optional.ofNullable(updateRequest.getLastname()).ifPresent(existingEmployee::setLastname);
        Optional.ofNullable(updateRequest.getAddress()).ifPresent(existingEmployee::setAddress);
        Optional.ofNullable(updateRequest.getDepartment()).ifPresent(existingEmployee::setDepartment);
        Optional.ofNullable(updateRequest.getDate_birth()).ifPresent(existingEmployee::setDate_birth);
        Optional.ofNullable(updateRequest.getJob()).ifPresent(existingEmployee::setJob);
        Optional.ofNullable(updateRequest.getHire_date()).ifPresent(existingEmployee::setHire_date);
        Optional.ofNullable(updateRequest.getSalary()).ifPresent(salary -> {
            if (salary != 0.0) existingEmployee.setSalary(salary);
        });
        Optional.ofNullable(updateRequest.getId_card()).ifPresent(existingEmployee::setId_card);
        Optional.ofNullable(updateRequest.getPhone()).ifPresent(existingEmployee::setPhone);
        Optional.ofNullable(updateRequest.getImage()).ifPresent(existingEmployee::setImage);



        return employeeRepository.save(existingEmployee);
    }


    @Override
    public boolean existsById(Long id) {
        return employeeRepository.existsById(id);
    }

    @Override
    public Employee getById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

    }

    public Map<String, Long> getEmployeeCountByGender() {
        List<Object[]> results = employeeRepository.countEmployeesByGender();
        Map<String, Long> employeeCountByGender = new HashMap<>();
        for (Object[] result : results) {
            String gender = (String) result[0];
            Long count = (Long) result[1];
            employeeCountByGender.put(gender, count);
        }
        return employeeCountByGender;
    }

    public Map<String, Long> getEmployeeCountByContractType() {
        List<Object[]> results = employeeRepository.countEmployeesByContractType();
        Map<String, Long> employeeCountByContractType = new HashMap<>();
        for (Object[] result : results) {
            String contractType = (String) result[0];
            Long count = (Long) result[1];
            employeeCountByContractType.put(contractType, count);
        }
        return employeeCountByContractType;
    }

    public Map<Integer, Long> getEmployeeCountByYear() {
        List<Object[]> results = employeeRepository.countEmployeesByYear();
        Map<Integer, Long> employeeCountByYear = new HashMap<>();
        for (Object[] result : results) {
            Integer year = Integer.parseInt((String) result[0]);
            Long count = (Long) result[1];
            employeeCountByYear.put(year, count);
        }
        return employeeCountByYear;
    }
    public Map<String, Long> getEmployeeCountByStatus() {
        List<Object[]> results = employeeRepository.countEmployeesByStatus();
        Map<String, Long> employeeCountByStatus = new HashMap<>();
        for (Object[] result : results) {
            Boolean status = (Boolean) result[0];
            Long count = (Long) result[1];
            employeeCountByStatus.put(status ? "Active" : "Deactivated", count);
        }
        return employeeCountByStatus;
    }


}
