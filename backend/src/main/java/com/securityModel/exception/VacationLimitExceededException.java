package com.securityModel.exception;

public class VacationLimitExceededException extends RuntimeException {
    public VacationLimitExceededException(String message) {
        super(message);
    }
}
