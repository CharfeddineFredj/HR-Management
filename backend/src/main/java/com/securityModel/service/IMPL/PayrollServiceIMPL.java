package com.securityModel.service.IMPL;


import com.securityModel.models.*;
import com.securityModel.repository.*;
import com.securityModel.service.PayrollService;
import com.securityModel.utils.StorgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PayrollServiceIMPL implements PayrollService {
    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private PointageRepository pointageRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WorkDayRepository workDayRepository;
    @Autowired
    private HolidayRespository  holidayRepository;

    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private StorgeService storageService;
    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private AdminRepository administrateurRepository;
    @Autowired
    private  WorkScheduleRepository workScheduleRepository;


    @Override
    public Payroll calculatePayroll(User user, LocalDate payrollDate) {
        Optional<Payroll> existingPayroll = payrollRepository.findByUserAndPayrollDate(user, payrollDate);

        double totalHoursWorkedBeforeAdjustment = 0;
        double totalSalary = 0;
        double overtimeMinutes = 0;
        double undertimeMinutes = 0;
        double minuteRate = 0;

        YearMonth payrollYearMonth = YearMonth.from(payrollDate); // Use YearMonth to filter pointages by month and year

        List<Pointage> pointages = pointageRepository.findByUserId(user.getId());
        boolean hasValidPointage = false; // Flag to check if there are valid pointages

        for (Pointage pointage : pointages) {
            if (YearMonth.from(pointage.getCheckInTime().toLocalDate()).equals(payrollYearMonth) &&
                    pointage.getCheckInTime() != null && pointage.getCheckOutTime() != null &&
                    Duration.between(pointage.getCheckInTime(), pointage.getCheckOutTime()).toMinutes() > 0) {

                hasValidPointage = true; // Set the flag to true if there's at least one valid pointage

                LocalDate pointageDate = pointage.getCheckInTime().toLocalDate();
                DayOfWeek dayOfWeek = pointageDate.getDayOfWeek();

                Optional<WorkDay> workDay = workDayRepository.findByWorkScheduleUserAndDayOfWeek(user, dayOfWeek);
                double monthlySalary = 0;

                if (user instanceof Employee) {
                    monthlySalary = ((Employee) user).getSalary();
                } else if (user instanceof Administrateur) {
                    monthlySalary = ((Administrateur) user).getSalary();
                }

                double dailyRate = monthlySalary / 22;
                double hourlyRate = dailyRate / 8;
                minuteRate = hourlyRate / 60;

                Duration workedDuration = Duration.between(pointage.getCheckInTime(), pointage.getCheckOutTime());
                double minutesWorked = workedDuration.toMinutes();
                double standardMinutes = 480; // 480 minutes = 8 hours

                boolean declared = workDay.isPresent() && workDay.get().isDeclared();
                boolean isHoliday = holidayRepository.findByDate(pointageDate).isPresent(); // Vérifier si le jour de pointage est un jour férié

                // Si c'est un jour férié, doubler les minutes travaillées
                if (isHoliday) {
                    if (!declared) {
                        // Si c'est un jour férié et non déclaré, ignorer les heures supplémentaires
                        minutesWorked = Math.min(minutesWorked, standardMinutes);
                    } else {
                        minutesWorked *= 2;
                    }
                }

                // Ajoutez les heures travaillées au total des heures avant ajustement
                double hoursWorkedToday = minutesWorked / 60.0;
                totalHoursWorkedBeforeAdjustment += hoursWorkedToday;

                // Journaux de débogage pour le calcul des minutes travaillées
                System.out.println("User: " + user.getUsername());
                System.out.println("Minutes Worked: " + minutesWorked);
                System.out.println("Declared: " + declared);
                System.out.println("Is Holiday: " + isHoliday);

                if (declared && minutesWorked > standardMinutes) {
                    overtimeMinutes += (minutesWorked - standardMinutes);
                }

                if (minutesWorked < standardMinutes) {
                    undertimeMinutes += (standardMinutes - minutesWorked);
                }

                System.out.println("Undertime Minutes (calculated): " + undertimeMinutes);
                System.out.println("Overtime Minutes (calculated): " + overtimeMinutes);

                totalSalary += dailyRate;
            }
        }

        if (!hasValidPointage) {
            // If there are no valid pointages, return null or handle as appropriate
            return null;
        }

        // Log les valeurs avant d'ajuster totalHoursWorked
        System.out.println("Total Hours Worked (before adjustment): " + totalHoursWorkedBeforeAdjustment);

        // Ajuster totalHoursWorked avec overtime et undertime sans double soustraction
        double adjustedHoursWorked = totalHoursWorkedBeforeAdjustment + (overtimeMinutes / 60.0) - (undertimeMinutes / 60.0);

        double primeMinuteWork = (overtimeMinutes - undertimeMinutes) * minuteRate;
        totalSalary += primeMinuteWork;

        // Log les valeurs après ajustement pour vérification
        System.out.println("Calculating payroll for user: " + user.getUsername());
        System.out.println("Total Hours Worked (after adjustment): " + adjustedHoursWorked);
        System.out.println("Total Salary: " + totalSalary);
        System.out.println("Overtime Minutes: " + overtimeMinutes);
        System.out.println("Undertime Minutes: " + undertimeMinutes);

        Payroll payroll;
        if (existingPayroll.isPresent()) {
            payroll = existingPayroll.get();
            payroll.setTotalHoursWorked(adjustedHoursWorked); // Utilisez les heures ajustées
            payroll.setTotalSalary(totalSalary);
            payroll.setOvertimeMinutes(overtimeMinutes);
            payroll.setUndertimeMinutes(undertimeMinutes); // Ensure this line is present
            payroll.setTotalHoursWorkedBeforeAdjustment(totalHoursWorkedBeforeAdjustment); // Enregistrer les heures avant ajustement
        } else {
            payroll = new Payroll(user, payrollDate, adjustedHoursWorked, totalSalary, overtimeMinutes, undertimeMinutes, totalHoursWorkedBeforeAdjustment);
        }

        return payrollRepository.save(payroll);
    }




    @Override
    public List<Payroll> getPayrollsByUser(User user) {
        return payrollRepository.findByUser(user);
    }


    @Override
    public List<Payroll> getPayrollsByYear(int year) {
        List<Payroll> allPayrolls = payrollRepository.findAll();
        return allPayrolls.stream()
                .filter(payroll -> payroll.getPayrollDate().getYear() == year)
                .collect(Collectors.toList());
    }


    @Override
    public void calculatePayrollForAllEmployees(LocalDate payrollDate) {
        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {
            calculatePayroll(user, payrollDate);
        }
    }


    public List<Payroll> getPayrollsByUserAndMonth(User user, YearMonth month) {
        List<Payroll> allPayrolls = payrollRepository.findByUser(user);
        return allPayrolls.stream()
                .filter(payroll -> YearMonth.from(payroll.getPayrollDate()).equals(month))
                .collect(Collectors.toList());
    }

    @Override
    public List<Payroll> getPayrollsByMonth(YearMonth yearMonth) {
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        return payrollRepository.findByPayrollDateBetween(startDate, endDate);
    }


    @Override
    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id).orElseThrow(() -> new RuntimeException("Payroll not found"));
    }



    public void sendPayslipNotification(MultipartFile file, String username) {
        try {
            // Save the file using StorgeService
            String fileName = storageService.store(file, false);

            // Find the user by username
            User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

            // Send WebSocket notification with a link to download the payslip
            String notificationMessage = "Your payslip is ready. Click here to download.";
            String downloadLink = "/payroll/downloadFile/" + fileName;
            Notification notification = new Notification(user.getId().toString(), notificationMessage, downloadLink);
            template.convertAndSend("/topic/notifications", notification);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send payslip notification", e);
        }
    }

    public Resource loadFile(String fileName) {
        return storageService.loadFile(fileName, false);
    }
}





