package com.securityModel.exception;

public class NoCheckInFoundException extends RuntimeException{
    public NoCheckInFoundException(String message) {
        super(message);
    }
}
