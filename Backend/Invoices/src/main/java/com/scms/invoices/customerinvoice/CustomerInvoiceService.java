package com.scms.invoices.customerinvoice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CustomerInvoiceService {
    private final CustomerInvoiceRepository customerInvoiceRepository;

    @Autowired
    public CustomerInvoiceService(CustomerInvoiceRepository customerInvoiceRepository) {
        this.customerInvoiceRepository = customerInvoiceRepository;
    }

    public CustomerInvoiceDto addCustomerInvoice(CustomerInvoiceDto customerInvoiceDto) {
        CustomerInvoice customerInvoice = new CustomerInvoice();
        customerInvoice.setCustomerId(customerInvoiceDto.getCustomerId());
        customerInvoice.setUserId(((Long)SecurityContextHolder.getContext().getAuthentication().getCredentials()).intValue());
        customerInvoice.setInvoiceDate(new Date());

        customerInvoice.setCustomerInvoiceProducts(new ArrayList<>());
        CustomerInvoice insertedCustomerInvoice = customerInvoiceRepository.save(customerInvoice);

        List<CustomerInvoiceProduct> customerInvoiceProducts = new ArrayList<>();
        for(InvoiceProductDto invoiceProductDto : customerInvoiceDto.getInvoiceProducts()) {
            CustomerInvoiceProduct customerInvoiceProduct = new CustomerInvoiceProduct();
            customerInvoiceProduct.setCustomerInvoice(insertedCustomerInvoice);
            customerInvoiceProduct.setProductId(invoiceProductDto.getProductId());
            customerInvoiceProduct.setQty(new BigDecimal(invoiceProductDto.getQuantity()));
            customerInvoiceProducts.add(
                    customerInvoiceProduct
            );
        }
        insertedCustomerInvoice.setCustomerInvoiceProducts(customerInvoiceProducts);
        insertedCustomerInvoice = customerInvoiceRepository.save(insertedCustomerInvoice);
        CustomerInvoiceDto insertedCustomerInvoiceDto = new CustomerInvoiceDto();
        insertedCustomerInvoiceDto.setCustomerInvoiceId(insertedCustomerInvoice.getCustomerInvoiceId());
        insertedCustomerInvoiceDto.setCustomerId(insertedCustomerInvoice.getCustomerId());
        insertedCustomerInvoiceDto.setUserId(insertedCustomerInvoice.getUserId());
        List<InvoiceProductDto> invoiceProductDtos = new ArrayList<>();
        for(CustomerInvoiceProduct customerInvoiceProduct : insertedCustomerInvoice.getCustomerInvoiceProducts()) {
            invoiceProductDtos.add(new InvoiceProductDto(customerInvoiceProduct.getCustomerInvoice().getCustomerInvoiceId(), customerInvoiceProduct.getProductId(), customerInvoiceProduct.getQty().toPlainString()));
        }
        insertedCustomerInvoiceDto.setInvoiceProducts(invoiceProductDtos);
        return insertedCustomerInvoiceDto;
    }

    public List<CustomerInvoiceDto> getCustomerInvoices() {
        List<CustomerInvoice> customerInvoices = customerInvoiceRepository.findAll();
        List<CustomerInvoiceDto> customerInvoiceDtos = new ArrayList<>();
        for(CustomerInvoice customerInvoice : customerInvoices) {
            CustomerInvoiceDto customerInvoiceDto = new CustomerInvoiceDto();
            customerInvoiceDto.setCustomerInvoiceId(customerInvoice.getCustomerInvoiceId());
            customerInvoiceDto.setCustomerId(customerInvoice.getCustomerId());
            customerInvoiceDto.setUserId(customerInvoice.getUserId());
            customerInvoiceDto.setInvoiceDate(new SimpleDateFormat("yyyy-MM-dd").format(customerInvoice.getInvoiceDate()));
            List<InvoiceProductDto> invoiceProductDtos = new ArrayList<>();
            for(CustomerInvoiceProduct customerInvoiceProduct : customerInvoice.getCustomerInvoiceProducts()) {
                invoiceProductDtos.add(new InvoiceProductDto(customerInvoiceProduct.getCustomerInvoice().getCustomerInvoiceId(), customerInvoiceProduct.getProductId(), customerInvoiceProduct.getQty().toPlainString()));
            }
            customerInvoiceDto.setInvoiceProducts(invoiceProductDtos);
            customerInvoiceDtos.add(customerInvoiceDto);
        }
        return customerInvoiceDtos;
    }

    public CustomerInvoiceDto deleteCustomerInvoice(Integer id) {
        try {
            customerInvoiceRepository.deleteById(id);
            return new CustomerInvoiceDto(id, 0, null, 0, null);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }
}
