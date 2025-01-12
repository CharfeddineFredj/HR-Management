package com.securityModel.controllers;


import com.securityModel.models.Payroll;
import com.securityModel.models.User;
import com.securityModel.models.Notification;
import com.securityModel.repository.UserRepository;
import com.securityModel.service.PayrollService;
import com.securityModel.utils.StorgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;


@RestController
@CrossOrigin("*")
@RequestMapping("/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StorgeService storageService;
    @Autowired
    private SimpMessagingTemplate template;

    @PostMapping("/calculate")
    public Payroll calculatePayroll(@RequestParam String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate payrollDate = LocalDate.now(); // For the current month
        return payrollService.calculatePayroll(user, payrollDate);
    }


    @GetMapping("/{username}")
    public List<Payroll> getPayrollsByUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return payrollService.getPayrollsByUser(user);
    }


    @GetMapping("/year/{payrollYear}")
    public List<Payroll> getPayrollsByYear(@PathVariable int payrollYear) {
        return payrollService.getPayrollsByYear(payrollYear);
    }

    @PostMapping("/calculateAll")
    public void calculatePayrollForAll(@RequestParam int year, @RequestParam int month) {
        LocalDate payrollDate = LocalDate.of(year, month, 1); // Utiliser le premier jour du mois spécifié
        payrollService.calculatePayrollForAllEmployees(payrollDate);
    }

    @GetMapping("/{username}/{year}/{month}")
    public List<Payroll> getPayrollsByUserAndMonth(@PathVariable String username, @PathVariable int year, @PathVariable int month) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        YearMonth yearMonth = YearMonth.of(year, month);
        return payrollService.getPayrollsByUserAndMonth(user, yearMonth);
    }

    @GetMapping("/{year}/{month}")
    public List<Payroll> getPayrollsByMonth(@PathVariable int year, @PathVariable int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        return payrollService.getPayrollsByMonth(yearMonth);
    }

    @GetMapping("/details/{id}")
    public Payroll getPayrollById(@PathVariable Long id) {
        return payrollService.getPayrollById(id);
    }



    // Endpoint to upload payslip and send notification to a specific user
    @PostMapping("/sendPayslip")
    public ResponseEntity<?> sendPayslip(@RequestParam("file") MultipartFile file, @RequestParam("username") String username) {
        // Store the file
        String fileName = storageService.store(file, false);

        // Send notification
        String downloadLink = "http://localhost:8086/payroll/downloadFile/" + fileName;
        Notification notification = new Notification("Your payslip is ready", downloadLink);
        template.convertAndSend("/topic/user/" + username + "/notifications", notification);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/downloadFile/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        Resource file = payrollService.loadFile(fileName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }


}
