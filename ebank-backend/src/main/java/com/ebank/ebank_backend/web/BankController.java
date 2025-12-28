package com.ebank.ebank_backend.web;

import com.ebank.ebank_backend.dto.ClientDTO;
import com.ebank.ebank_backend.dto.TransferRequest;
import com.ebank.ebank_backend.entities.AccountOperation;
import com.ebank.ebank_backend.entities.BankAccount;
import com.ebank.ebank_backend.entities.Client;
import com.ebank.ebank_backend.repositories.AccountRepository;
import com.ebank.ebank_backend.repositories.ClientRepository;
import com.ebank.ebank_backend.services.BankService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BankController {
    private final BankService bankService;
    private final ClientRepository clientRepository;
    private final AccountRepository accountRepository; // Inject Repository

    @PostMapping("/admin/clients")
    public void createClient(@RequestBody ClientDTO dto) {
        bankService.addClient(dto);
    }

    @GetMapping("/admin/clients")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @PostMapping("/admin/accounts")
    public void createAccount(@RequestParam String rib, @RequestParam String idNum) {
        bankService.createAccount(rib, idNum);
    }

    @GetMapping("/client/history/{rib}")
    public Page<AccountOperation> getHistory(@PathVariable String rib,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "5") int size) {
        return bankService.getHistory(rib, page, size);
    }

    @PostMapping("/client/transfer")
    public void transfer(@RequestBody TransferRequest request) {
        bankService.transfer(request.getSourceRib(), request.getDestRib(), request.getAmount());
    }

    // --- FIX: GET MY ACCOUNTS ---
    // This removes the "Ghost Data" issue
    @GetMapping("/client/my-accounts")
    public List<BankAccount> getMyAccounts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return accountRepository.findByClient_Email(email);
    }
}