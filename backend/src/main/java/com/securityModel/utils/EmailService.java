package com.securityModel.utils;

import com.securityModel.models.Email;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.io.File;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender emailSender ;

    public void sendSimpleMessage(final Email mail){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject(mail.getSubject());
        message.setText(mail.getContent());
        message.setTo(mail.getTo());
        message.setFrom(mail.getFrom());

        emailSender.send(message);
    }
    public void sendHtmlMessageWithInlineImage(final Email mail, String imagePath, String imageContentId) {
        MimeMessage message = emailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(mail.getTo());
            helper.setSubject(mail.getSubject());
            helper.setFrom(mail.getFrom());
            helper.setText(mail.getContent(), true);

            // Add inline image
            FileSystemResource res = new FileSystemResource(new File(imagePath));
            helper.addInline(imageContentId, res);

            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

}
