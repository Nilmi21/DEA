package com.scms.invoices.supplierinvoice;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/supplierinvoice")
public class SupplierInvoiceController {
    private final SupplierInvoiceService supplierInvoiceService;

    public SupplierInvoiceController(SupplierInvoiceService supplierInvoiceService) {
        this.supplierInvoiceService = supplierInvoiceService;
    }

    @PostMapping
    public SupplierInvoiceDto addSupplierInvoice(@RequestBody SupplierInvoiceDto supplierInvoiceDto) {
        try{
            return supplierInvoiceService.addSupplierInvoice(supplierInvoiceDto);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    @DeleteMapping(path = "{supplierInvoiceId}")
    public SupplierInvoiceDto deleteSupplierInvoice(@PathVariable Integer supplierInvoiceId) {
        return supplierInvoiceService.deleteSupplierInvoice(supplierInvoiceId);
    }

    @GetMapping
    public List<SupplierInvoiceDto> getSupplierInvoices() {
        return supplierInvoiceService.getSupplierInvoices();
    }

}
