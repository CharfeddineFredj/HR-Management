package com.securityModel.controllers;

import java.security.SecureRandom;
import java.util.Random;

public class RandomCodeGenerator {
    private static final int LENGTH = 6;
    private static final Random RANDOM = new SecureRandom();

    public static String generateRandomCode() {
        StringBuilder sb = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) {
            sb.append(RANDOM.nextInt(10));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        String randomCode = generateRandomCode();
        System.out.println("Votre code est :" + randomCode);
    }
}

