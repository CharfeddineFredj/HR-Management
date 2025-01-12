package com.securityModel.service.IMPL;

import com.securityModel.models.Holiday;
import com.securityModel.repository.HolidayRespository;
import com.securityModel.service.HolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Service
public class HolidayServiceIMPL implements HolidayService {
    @Autowired
    private HolidayRespository holidayRepository;

    @Override
    public Holiday addHoliday(Holiday holiday) {
        return holidayRepository.save(holiday);
    }

    @Override
    public Holiday getbyId(Long id) {
        return holidayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("holiday with id " + id + " not found"));
    }

    @Override
    public List<Holiday> addHolidays(List<Holiday> holidays) {
        return holidayRepository.saveAll(holidays);
    }

    @Override
    public Optional<Holiday> getHolidayByDate(LocalDate date) {
        return holidayRepository.findByDate(date);
    }

    @Override
    public List<Holiday> getAllHolidays() {
        return holidayRepository.findAll();
    }

    @Override
    public Holiday updateHoliday(Long id, Holiday holidayDetails) {
        Optional<Holiday> optionalHoliday = holidayRepository.findById(id);
        if (optionalHoliday.isPresent()) {
            Holiday holiday = optionalHoliday.get();
            holiday.setDate(holidayDetails.getDate());
            holiday.setDescription(holidayDetails.getDescription());
            return holidayRepository.save(holiday);
        } else {
            throw new RuntimeException("Holiday not found");
        }
    }

    @Override
    public void deleteHoliday(Long id) {
        holidayRepository.deleteById(id);
    }
}
