package com.scms.invoices.customerinvoice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerInvoiceDto {
    private Integer customerInvoiceId;
    private Integer customerId;
    private String invoiceDate;
    private Integer userId;
    private List<InvoiceProductDto> invoiceProducts;
}
