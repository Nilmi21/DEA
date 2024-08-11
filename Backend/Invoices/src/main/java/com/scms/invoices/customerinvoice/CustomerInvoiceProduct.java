package com.scms.invoices.customerinvoice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CustomerInvoiceProduct {
    @Id
    @ManyToOne
    @JoinColumn(name = "customer_invoice_id")
    private CustomerInvoice customerInvoice;
    @Id
    private Integer productId;
    private BigDecimal qty;
}
