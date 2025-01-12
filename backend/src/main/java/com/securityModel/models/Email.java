package com.securityModel.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Email {
    private String from;
    private String to;
    private String subject;
    private String content;
    private boolean html;
}
