package com.scms.invoices.customerinvoice;

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
public class CustomerInvoice {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Integer customerInvoiceId;
    private Integer customerId;
    private Integer userId;
    private Date invoiceDate;
    @OneToMany(mappedBy = "customerInvoice", cascade = CascadeType.ALL)
    private List<CustomerInvoiceProduct> customerInvoiceProducts;
}
