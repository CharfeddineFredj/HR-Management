package com.securityModel.controllers;

import com.securityModel.models.Candidate;
import com.securityModel.models.Holiday;
import com.securityModel.service.HolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/holidays")
public class HolidayController {
    @Autowired
    private HolidayService holidayService;

    @PostMapping("/add")
    public ResponseEntity<Holiday> addHoliday(@RequestBody Holiday holiday) {
        Holiday newHoliday = holidayService.addHoliday(holiday);
        return new ResponseEntity<>(newHoliday, HttpStatus.CREATED);
    }
    @GetMapping("getone/{id}")
    public Holiday getHolidayById(@PathVariable Long id){
        return holidayService.getbyId(id);
    }
    @PostMapping("/add-multiple")
    public ResponseEntity<List<Holiday>> addHolidays(@RequestBody List<Holiday> holidays) {
        List<Holiday> newHolidays = holidayService.addHolidays(holidays);
        return new ResponseEntity<>(newHolidays, HttpStatus.CREATED);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<Holiday> getHolidayByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        Optional<Holiday> holiday = holidayService.getHolidayByDate(localDate);
        if (holiday.isPresent()) {
            return new ResponseEntity<>(holiday.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Holiday>> getAllHolidays() {
        List<Holiday> holidays = holidayService.getAllHolidays();
        return new ResponseEntity<>(holidays, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Holiday> updateHoliday(@PathVariable Long id, @RequestBody Holiday holidayDetails) {
        try {
            Holiday updatedHoliday = holidayService.updateHoliday(id, holidayDetails);
            return new ResponseEntity<>(updatedHoliday, HttpStatus.OK);
        } catch (RuntimeException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteHoliday(@PathVariable Long id) {
        try {
            holidayService.deleteHoliday(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
