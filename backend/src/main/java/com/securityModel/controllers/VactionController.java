package com.securityModel.controllers;

import com.securityModel.models.Vaction;
import com.securityModel.service.VactionService;
import com.securityModel.utils.StorgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@CrossOrigin("*")
@RequestMapping("/vactions")
public class VactionController {

    @Autowired
    private VactionService vactionService;

    @Autowired
    private StorgeService storgeService;

    @GetMapping("/all")
    public List<Vaction> getAllVactions() {
        return vactionService.getAllVactions();
    }

    @PostMapping("/add")
    public ResponseEntity<?> createVaction(
            @RequestParam("registrationNumber") String registrationNumber,
            @RequestParam("created_at") String createdAtString,
            @RequestParam("period") int period,
            @RequestParam("start_date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam("end_date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam("type_vacation") String typeVacation,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            // Parse the created_at string to a Date object
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
            Date createdAt = dateFormat.parse(createdAtString);

            // Create and set Vaction object
            Vaction vaction = new Vaction();
            vaction.setRegistrationNumber(registrationNumber);
            vaction.setCreated_at(createdAt);
            vaction.setPeriod(period);
            vaction.setStart_date(startDate);
            vaction.setEnd_date(endDate);
            vaction.setType_vacation(typeVacation);

            if (file != null && !file.isEmpty()) {
                String filename = storgeService.store(file, false);
                vaction.setMedicalCertificate(filename);
            }

            Vaction newVaction = vactionService.createVaction(vaction);
            return ResponseEntity.ok(newVaction);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Failed to parse date: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload medical certificate: " + e.getMessage());
        }
    }




    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteVaction(@PathVariable Long id) {
        vactionService.deleteVaction(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Vaction> approveVaction(@PathVariable Long id) {
        try {
            Vaction approvedVaction = vactionService.approveVaction(id);
            return ResponseEntity.ok(approvedVaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Vaction> rejectVaction(@PathVariable Long id) {
        try {
            Vaction rejectedVaction = vactionService.rejectVaction(id);
            return ResponseEntity.ok(rejectedVaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{registrationNumber}")
    public ResponseEntity<List<Vaction>> getEmployeeVacations(@PathVariable("registrationNumber") String registrationNumber) {
        List<Vaction> vacations = vactionService.getVacationsByRegistrationNumber(registrationNumber);
        return ResponseEntity.ok(vacations);
    }

    @GetMapping("/vacation-days")
    public ResponseEntity<Map<String, Integer>> getVacationDays(@RequestParam String registrationNumber, @RequestParam int year) {
        int spentDays = vactionService.calculateSpentDays(registrationNumber, year);
        int remainingDays = vactionService.calculateRemainingDays(registrationNumber, year);
        Map<String, Integer> response = new HashMap<>();
        response.put("spentDays", spentDays);
        response.put("remainingDays", remainingDays);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available-years")
    public ResponseEntity<List<Integer>> getAvailableYears() {
        List<Integer> years = vactionService.getAvailableYears();
        return ResponseEntity.ok(years);
    }

    @GetMapping("/getone/{id}")
    public ResponseEntity<Vaction> getVactionById(@PathVariable Long id) {
        Vaction vaction = vactionService.getVactionById(id);
        if (vaction != null) {
            return ResponseEntity.ok(vaction);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        Resource resource = storgeService.loadFile(filename, false); // Assuming it's not an image

        String contentType = "application/pdf"; // Adjust this based on your file type

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
