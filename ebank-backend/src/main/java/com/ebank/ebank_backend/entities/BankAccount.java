package com.ebank.ebank_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class BankAccount {
    @Id
    private String rib; // UC-3: RIB must be valid

    private double balance; // UC-4: Solde du compte

    private String status; // RG_10: Created with "Ouvert" status

    @ManyToOne
    @JsonIgnoreProperties("accounts") // Stops serialization from nesting into the client's account list
    private Client client;

    @OneToMany(mappedBy = "account")
    @JsonIgnoreProperties("account") // Optional: prevents recursion in operation history
    private List<AccountOperation> operations;
}