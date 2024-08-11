package com.scms.invoices.customerinvoice;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/customerinvoice")
public class CustomerInvoiceController {
    private final CustomerInvoiceService customerInvoiceService;

    public CustomerInvoiceController(CustomerInvoiceService customerInvoiceService) {
        this.customerInvoiceService = customerInvoiceService;
    }

    @PostMapping
    public CustomerInvoiceDto addCustomerInvoice(@RequestBody CustomerInvoiceDto customerInvoiceDto) {
        try {
            return customerInvoiceService.addCustomerInvoice(customerInvoiceDto);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    @DeleteMapping(path = "{id}")
    public CustomerInvoiceDto deleteCustomerInvoice(@PathVariable Integer id) {
        return customerInvoiceService.deleteCustomerInvoice(id);
    }

    @GetMapping
    public List<CustomerInvoiceDto> getCustomerInvoices() {
        return customerInvoiceService.getCustomerInvoices();
    }
}
