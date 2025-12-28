package com.ebank.ebank_backend;

import com.ebank.ebank_backend.entities.BankAccount;
import com.ebank.ebank_backend.entities.Client;
import com.ebank.ebank_backend.repositories.AccountRepository;
import com.ebank.ebank_backend.repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final ClientRepository clientRepository;
    private final AccountRepository accountRepository;

    @Override
    public void run(String... args) throws Exception {
        String testEmail = "john.doe@test.com";
        // RG_6: Check for the actual email you are about to save
        if (clientRepository.findByEmail(testEmail).isEmpty()) {
            Client client = new Client();
            client.setFirstName("John");
            client.setLastName("Doe");
            client.setIdentityNumber("AB12345"); // RG_4: Must be unique
            client.setEmail(testEmail);
            client.setAddress("123 Bank Street");
            client.setBirthDate(new Date());
            clientRepository.save(client);

            BankAccount account = new BankAccount();
            account.setRib("123456789012345678901234"); // RG_9: RIB must be valid [cite: 55]
            account.setBalance(1000.0);
            account.setStatus("Ouvert"); // RG_10: Default status [cite: 55]
            account.setClient(client);
            accountRepository.save(account);

            System.out.println(">>> Test Data Initialized.");
        } else {
            System.out.println(">>> Test Data already exists.");
        }
    }
}