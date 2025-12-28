package com.ebank.ebank_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName; // RG_5

    private String lastName; // RG_5

    @Column(unique = true)
    private String identityNumber; // RG_4: Unique

    private Date birthDate; // RG_5

    @Column(unique = true)
    private String email; // RG_6: Unique

    private String address; // RG_5

    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("client") // Breaks the infinite recursion loop back to Client
    private List<BankAccount> accounts;
}