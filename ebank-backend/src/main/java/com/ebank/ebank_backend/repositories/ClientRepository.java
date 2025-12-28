package com.ebank.ebank_backend.repositories;

import com.ebank.ebank_backend.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByIdentityNumber(String identityNumber);
    Optional<Client> findByEmail(String email);
}