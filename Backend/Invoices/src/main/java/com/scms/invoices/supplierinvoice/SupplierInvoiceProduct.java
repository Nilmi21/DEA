package com.scms.invoices.supplierinvoice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class SupplierInvoiceProduct {
    @Id
    @ManyToOne
    @JoinColumn(name = "supplier_invoice_id")
    private SupplierInvoice supplierInvoice;
    @Id
    private Integer productId;
    private BigDecimal qty;
}
