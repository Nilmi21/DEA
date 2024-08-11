package com.scms.invoices.customerinvoice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceProductDto {
    private Integer invoiceId;
    private Integer productId;
    private String quantity;
}
