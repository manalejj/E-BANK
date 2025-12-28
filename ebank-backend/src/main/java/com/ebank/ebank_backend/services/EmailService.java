package com.ebank.ebank_backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendCredentialEmail(String toEmail, String firstName, String login, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Bienvenue chez eBank - Vos identifiants de connexion");

        String body = "Bonjour " + firstName + ",\n\n" +
                "Votre compte client a été créé avec succès.\n" +
                "Voici vos informations de connexion confidentielles :\n\n" +
                "--------------------------------------------------\n" +
                "LOGIN    : " + login + "\n" +
                "PASSWORD : " + password + "\n" +
                "--------------------------------------------------\n\n" +
                "Pour des raisons de sécurité, veuillez changer votre mot de passe dès votre première connexion.\n\n" +
                "Cordialement,\n" +
                "L'équipe eBank.";

        message.setText(body);

        try {
            mailSender.send(message);
            System.out.println(">>> EMAIL SENT SUCCESSFULLY TO: " + toEmail);
        } catch (Exception e) {
            System.err.println(">>> ERROR SENDING EMAIL: " + e.getMessage());
            // We do not throw exception here to prevent rolling back the client creation
            // if mail server is down.
        }
    }
}