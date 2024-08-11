package com.scms.suppliers.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Supplier {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long supplierId;

    @Column(unique = true)
    private String supplierName;
    private String supplierMobile;
    private String supplierAddress;
    private Long userId;

}
