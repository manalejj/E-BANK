package com.ebank.ebank_backend.repositories;

import com.ebank.ebank_backend.entities.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRepository extends JpaRepository<BankAccount, String> {
    // Find all accounts belonging to a specific client email
    List<BankAccount> findByClient_Email(String email);
}