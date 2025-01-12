package com.securityModel.service;


import com.securityModel.models.Holiday;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HolidayService {

    Holiday addHoliday(Holiday holiday);



    List<Holiday> addHolidays(List<Holiday> holidays); // Nouvelle méthode

    Optional<Holiday> getHolidayByDate(LocalDate localDate);

    List<Holiday> getAllHolidays();

    Holiday updateHoliday(Long id, Holiday holidayDetails);

    void deleteHoliday(Long id);

    Holiday getbyId(Long id);
}
