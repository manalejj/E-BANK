package com.ebank.ebank_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class AccountOperation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date operationDate;
    private double amount;
    private String type; // DEBIT or CREDIT [cite: 63]
    private String description;
    @ManyToOne
    private BankAccount account;
}