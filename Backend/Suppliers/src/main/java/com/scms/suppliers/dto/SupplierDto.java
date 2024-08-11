package com.scms.suppliers.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDto {
    private long supplierId;
    private String supplierName;
    private String supplierMobile;
    private String supplierAddress;
    private long userId;

}
