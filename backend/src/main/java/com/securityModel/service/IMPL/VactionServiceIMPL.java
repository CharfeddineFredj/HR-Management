package com.securityModel.service.IMPL;

import com.securityModel.exception.VacationLimitExceededException;
import com.securityModel.models.Administrateur;
import com.securityModel.models.Employee;
import com.securityModel.models.Vaction;
import com.securityModel.models.WorkSchedule;
import com.securityModel.repository.AdminRepository;
import com.securityModel.repository.EmployeeRepository;
import com.securityModel.repository.VactionRepository;
import com.securityModel.service.VactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class VactionServiceIMPL implements VactionService {
    private static final int ANNUAL_VACATION_LIMIT = 24;

    @Autowired
    private VactionRepository vactionRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AdminRepository administratorRepository;
    @Override
    public List<Vaction> getAllVactions() {
        List<Vaction> vacations = vactionRepository.findAll();
        for (Vaction vacation : vacations) {
            String registrationNumber = vacation.getRegistrationNumber();
            Optional<Employee> employee = employeeRepository.findByUsername(registrationNumber);
            Optional<Administrateur> admin = administratorRepository.findByUsername(registrationNumber);

            if (employee.isPresent()) {
                vacation.setImageUrl(employee.get().getImage());
            } else if (admin.isPresent()) {
                vacation.setImageUrl(admin.get().getImage());
            }
        }
        return vacations;
    }




    @Override
    public Vaction createVaction(Vaction vaction) {
        validateSpentDaysVaction(vaction);
        vaction.setSpent_days_vaction(vaction.getPeriod());
        vaction.setRemaining_days_vaction(ANNUAL_VACATION_LIMIT - vaction.getSpent_days_vaction());
        return vactionRepository.save(vaction);
    }

    @Override
    public void deleteVaction(Long id) {
        vactionRepository.deleteById(id);
    }

    @Override
    public Vaction approveVaction(Long id) {
        Vaction vaction = vactionRepository.findById(id).orElseThrow(() -> new RuntimeException("Vaction not found"));
        vaction.setStatus("approved");
        Integer totalSpentDays = calculateApprovedSpentDays(vaction.getRegistrationNumber(), vaction.getCreated_at()) + vaction.getSpent_days_vaction();

        if (totalSpentDays > ANNUAL_VACATION_LIMIT) {
            throw new VacationLimitExceededException("The total spent vacation days exceed the annual limit of " + ANNUAL_VACATION_LIMIT);
        }

        vaction.setRemaining_days_vaction(ANNUAL_VACATION_LIMIT - totalSpentDays);
        if (vaction.getRemaining_days_vaction() < 0) {
            throw new VacationLimitExceededException("Remaining vacation days cannot be less than 0. The employee has exceeded the limit for the year.");
        }

        return vactionRepository.save(vaction);
    }

    @Override
    public Vaction rejectVaction(Long id) {
        Vaction vaction = vactionRepository.findById(id).orElseThrow(() -> new RuntimeException("Vaction not found"));
        vaction.setStatus("rejected");
        return vactionRepository.save(vaction);
    }



    @Override
    public List<Vaction> getVacationsByRegistrationNumber(String registrationNumber) {
        return vactionRepository.findByRegistrationNumber(registrationNumber);
    }



    public int calculateSpentDays(String registrationNumber, int year) {
        List<Vaction> vacations = vactionRepository.findApprovedVacationsByRegistrationNumberAndYear(registrationNumber, year);
        return vacations.stream().mapToInt(Vaction::getPeriod).sum();
    }

    public int calculateRemainingDays(String registrationNumber, int year) {
        int spentDays = calculateSpentDays(registrationNumber, year);
        return ANNUAL_VACATION_LIMIT - spentDays;
    }

    private void validateSpentDaysVaction(Vaction vaction) {
        Integer totalSpentDays = calculateApprovedSpentDays(vaction.getRegistrationNumber(), vaction.getCreated_at());

        if (totalSpentDays + vaction.getPeriod() > ANNUAL_VACATION_LIMIT) {
            throw new VacationLimitExceededException("The total spent vacation days cannot exceed " + ANNUAL_VACATION_LIMIT + " for the year.");
        }
    }

    private Integer calculateApprovedSpentDays(String registrationNumber, Date createdAt) {
        int year = getYear(createdAt);
        List<Vaction> approvedVacations = vactionRepository.findApprovedVacationsByRegistrationNumberAndYear(registrationNumber, year);
        return approvedVacations.stream().mapToInt(Vaction::getPeriod).sum();
    }

    private int getYear(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.YEAR);
    }
    public List<Integer> getAvailableYears() {
        return vactionRepository.findDistinctYears();
    }

    @Override
    public Vaction getVactionById(Long id) {
        Vaction vacation = vactionRepository.findById(id).orElse(null);
        if (vacation != null) {
            String registrationNumber = vacation.getRegistrationNumber();
            Optional<Employee> employee = employeeRepository.findByUsername(registrationNumber);
            Optional<Administrateur> admin = administratorRepository.findByUsername(registrationNumber);

            if (employee.isPresent()) {
                vacation.setImageUrl(employee.get().getImage());
            } else if (admin.isPresent()) {
                vacation.setImageUrl(admin.get().getImage());
            }
        }
        return vacation;
    }
}
