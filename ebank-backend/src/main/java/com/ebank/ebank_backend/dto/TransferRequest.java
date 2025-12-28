package com.ebank.ebank_backend.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private String sourceRib;
    private String destRib;
    private double amount;
}