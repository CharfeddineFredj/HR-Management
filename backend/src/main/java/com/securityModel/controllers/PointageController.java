package com.securityModel.controllers;

import com.securityModel.exception.AlreadyCheckedInException;
import com.securityModel.exception.NoCheckInFoundException;
import com.securityModel.models.Employee;
import com.securityModel.models.Pointage;
import com.securityModel.payload.request.CheckInRequest;
import com.securityModel.payload.request.CheckOutRequest;
import com.securityModel.service.PointageService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/pointing")
public class PointageController {
    @Autowired
    private PointageService pointageService;

    @PutMapping("/checkIn")
    public ResponseEntity<?> checkIn(@RequestBody CheckInRequest checkInRequest) {
        try {
            Pointage pointage = pointageService.checkIn(
                    checkInRequest.getUsername(),
                    checkInRequest.getCheckInTime(),
                    checkInRequest.getLatitude(),
                    checkInRequest.getLongitude()
            );
            return new ResponseEntity<>(pointage, HttpStatus.OK);
        } catch (AlreadyCheckedInException | NoCheckInFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/checkOut")
    public ResponseEntity<?> checkOut(@RequestBody CheckOutRequest checkOutRequest) {
        try {
            Pointage pointage = pointageService.checkOut(
                    checkOutRequest.getUsername(),
                    checkOutRequest.getCheckOutTime(),
                    checkOutRequest.getLatitude(),
                    checkOutRequest.getLongitude()
            );
            return new ResponseEntity<>(pointage, HttpStatus.OK);
        } catch (NoCheckInFoundException | IllegalStateException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public List<Pointage> getAllPointages() {
        return pointageService.getAllPointages();
    }

    @PutMapping("/edit")
    public ResponseEntity<String> editPointage(@RequestParam Long id,
                                               @RequestParam(required = false)
                                               @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime checkInTime,
                                               @RequestParam(required = false)
                                               @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime checkOutTime) {
        try {

            if (checkInTime != null && checkOutTime != null) {
                return ResponseEntity.badRequest().body("Cannot set both check-in and check-out times simultaneously.");
            }

            String result = pointageService.editPointage(id, checkInTime, checkOutTime);
            if (result.equals("Pointage updated successfully.")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating pointage: " + e.getMessage());
        }
    }

    @GetMapping("/getone/{id}")
    public ResponseEntity<Pointage> getOne(@PathVariable Long id) {
        try {
            Pointage pointage = pointageService.getbyId(id);
            return ResponseEntity.ok(pointage);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Pointage>> getPointageHistoryByUserId(@PathVariable Long userId) {
        try {
            List<Pointage> pointages = pointageService.getPointagesByUserId(userId);
            return ResponseEntity.ok(pointages);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



}
