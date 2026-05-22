package com.elearn.lms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String frontendBaseUrl = "https://lms-frontend-882950565528.us-central1.run.app";

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String recipientEmail, String role, String token) {
        String resetUrl = frontendBaseUrl + "/reset-password?role=" + role + "&token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("Password Reset Instructions");
        message.setText("We received a request to reset your password.\n\n" +
                "Use the link below to set a new password. This link will expire soon.\n\n" +
                resetUrl + "\n\n" +
                "If you did not request this, please ignore this email.");

        mailSender.send(message);
    }
}

