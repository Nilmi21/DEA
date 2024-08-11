package com.scms.invoices.supplierinvoice;

import com.scms.invoices.customerinvoice.InvoiceProductDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierInvoiceDto {
    private Integer supplierInvoiceId;
    private Integer supplierId;
    private Integer userId;
    private String invoiceDate;
    private List<InvoiceProductDto> invoiceProducts;
}

