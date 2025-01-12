package com.securityModel.payload.request;

import java.time.DayOfWeek;

public class WorkDayRequest {
    private DayOfWeek dayOfWeek;
    private boolean declared;

    // Getters and Setters
    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public boolean isDeclared() {
        return declared;
    }

    public void setDeclared(boolean declared) {
        this.declared = declared;
    }
}
