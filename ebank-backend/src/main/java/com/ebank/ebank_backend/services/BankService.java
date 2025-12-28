package com.ebank.ebank_backend.services;

import com.ebank.ebank_backend.dto.ClientDTO;
import com.ebank.ebank_backend.entities.*;
import com.ebank.ebank_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class BankService {
    private final ClientRepository clientRepository;
    private final AccountRepository accountRepository;
    private final OperationRepository operationRepository;
    private final EmailService emailService;

    // INJECT SECURITY MANAGERS (Required for Login to work immediately after creation)
    private final InMemoryUserDetailsManager inMemoryUserDetailsManager;
    private final PasswordEncoder passwordEncoder;

    // UC-2: Add Client with Database Save + Security Registration + Real Email
    public void addClient(ClientDTO dto) {
        // 1. Validation (RG_4, RG_6) [cite: 53]
        if(clientRepository.findByIdentityNumber(dto.getIdentityNumber()).isPresent())
            throw new RuntimeException("RG_4: Identity number must be unique");
        if(clientRepository.findByEmail(dto.getEmail()).isPresent())
            throw new RuntimeException("RG_6: Email must be unique");

        // 2. Save Client to MySQL Database
        Client client = new Client();
        client.setFirstName(dto.getFirstName());
        client.setLastName(dto.getLastName());
        client.setIdentityNumber(dto.getIdentityNumber());
        client.setEmail(dto.getEmail());
        client.setBirthDate(dto.getBirthDate());
        client.setAddress(dto.getAddress());

        clientRepository.save(client);

        // 3. Generate a random secure password
        String generatedPassword = UUID.randomUUID().toString().substring(0, 8);

        // 4. REGISTER USER IN SPRING SECURITY (Crucial Step for Login!)
        // This adds the user to the "In-Memory" list so AuthController can authenticate them.
        UserDetails newUser = User.withUsername(client.getEmail()) // Login = Email
                .password(passwordEncoder.encode(generatedPassword)) // Hash the password
                .authorities("CLIENT") // Grant CLIENT role
                .build();

        inMemoryUserDetailsManager.createUser(newUser);

        // 5. Send Real Email (RG_7) [cite: 53]
        System.out.println(">>> Sending email to " + client.getEmail() + "...");
        emailService.sendCredentialEmail(
                client.getEmail(),
                client.getFirstName(),
                client.getEmail(),
                generatedPassword
        );
    }

    // UC-3: Create Bank Account
    public void createAccount(String rib, String identityNumber) {
        // RG_9: Validation du RIB (Must be 24 digits)
        // ADDED THIS BLOCK TO FIX MISSING REQUIREMENT
        if (rib == null || !rib.matches("\\d{24}")) {
            throw new RuntimeException("RG_9: Le RIB doit être un RIB valide (24 chiffres).");
        }

        Client client = clientRepository.findByIdentityNumber(identityNumber)
                .orElseThrow(() -> new RuntimeException("RG_8: Client not found")); //

        BankAccount account = new BankAccount();
        account.setRib(rib);
        account.setBalance(0.0);
        account.setStatus("Ouvert"); // RG_10
        account.setClient(client);
        accountRepository.save(account);
    }

    // UC-4: Consultation
    public Page<AccountOperation> getHistory(String rib, int page, int size) {
        return operationRepository.findByAccount_RibOrderByOperationDateDesc(rib, PageRequest.of(page, size));
    }

    // UC-5: Transfer with Names in Description
    public void transfer(String sourceRib, String destRib, double amount) {
        BankAccount source = accountRepository.findById(sourceRib)
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        BankAccount dest = accountRepository.findById(destRib)
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        // RG_11: Account blocked/closed check [cite: 75]
        if(!source.getStatus().equals("Ouvert"))
            throw new RuntimeException("RG_11: Account blocked/closed");

        // RG_12: Insufficient balance check [cite: 76]
        if(source.getBalance() < amount)
            throw new RuntimeException("RG_12: Insufficient balance");

        // RG_13 & RG_14: Debit/Credit logic [cite: 77, 78]
        source.setBalance(source.getBalance() - amount);
        dest.setBalance(dest.getBalance() + amount);

        String sourceName = source.getClient().getLastName() + " " + source.getClient().getFirstName();
        String destName = dest.getClient().getLastName() + " " + dest.getClient().getFirstName();

        // RG_15: Trace operations [cite: 79]
        saveOp(source, amount, "DEBIT", "Virement vers " + destName);
        saveOp(dest, amount, "CREDIT", "Virement de " + sourceName);
    }

    private void saveOp(BankAccount acc, double amt, String type, String desc) {
        AccountOperation op = new AccountOperation();
        op.setAmount(amt);
        op.setType(type);
        op.setDescription(desc);
        op.setOperationDate(new Date());
        op.setAccount(acc);
        operationRepository.save(op);
    }
}