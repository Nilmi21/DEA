package com.scms.invoices.supplierinvoice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SupplierInvoice {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Integer supplierInvoiceId;
    private Integer supplierId;
    private Integer userId;
    private Date invoiceDate;
    @OneToMany(mappedBy = "supplierInvoice", cascade = CascadeType.ALL)
    private List<SupplierInvoiceProduct> supplierInvoiceProducts;
}
