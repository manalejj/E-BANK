package com.ebank.ebank_backend.repositories;

import com.ebank.ebank_backend.entities.AccountOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OperationRepository extends JpaRepository<AccountOperation, Long> {
    // For UC-4: Pagination of operations [cite: 66]
    Page<AccountOperation> findByAccount_RibOrderByOperationDateDesc(String rib, Pageable pageable);
}