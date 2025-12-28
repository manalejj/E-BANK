package com.ebank.ebank_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor
public class ClientDTO {
    private String firstName; // RG_5 [cite: 53]
    private String lastName;  // RG_5 [cite: 53]
    private String identityNumber; // RG_4 [cite: 53]
    private Date birthDate; // RG_5 [cite: 53]
    private String email; // RG_6 [cite: 53]
    private String address; // RG_5 [cite: 53]
}