package com.scms.invoices.supplierinvoice;

import com.scms.invoices.customerinvoice.InvoiceProductDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class SupplierInvoiceService {
    private final SupplierInvoiceRepository supplierInvoiceRepository;

    @Autowired
    public SupplierInvoiceService(SupplierInvoiceRepository supplierInvoiceRepository) {
        this.supplierInvoiceRepository = supplierInvoiceRepository;
    }

    public SupplierInvoiceDto addSupplierInvoice(SupplierInvoiceDto supplierInvoiceDto) {
        SupplierInvoice supplierInvoice = new SupplierInvoice();
        supplierInvoice.setSupplierId(supplierInvoiceDto.getSupplierId());
        supplierInvoice.setUserId(((Long) SecurityContextHolder.getContext().getAuthentication().getCredentials()).intValue());
        supplierInvoice.setInvoiceDate(new Date());

        supplierInvoice.setSupplierInvoiceProducts(new ArrayList<>());
        SupplierInvoice insertedSupplierInvoice = supplierInvoiceRepository.save(supplierInvoice);

        List<SupplierInvoiceProduct> supplierInvoiceProducts = new ArrayList<>();
        for(InvoiceProductDto invoiceProductDto : supplierInvoiceDto.getInvoiceProducts()) {
            SupplierInvoiceProduct supplierInvoiceProduct = new SupplierInvoiceProduct();
            supplierInvoiceProduct.setSupplierInvoice(insertedSupplierInvoice);
            supplierInvoiceProduct.setProductId(invoiceProductDto.getProductId());
            supplierInvoiceProduct.setQty(new BigDecimal(invoiceProductDto.getQuantity()));
            supplierInvoiceProducts.add(
                    supplierInvoiceProduct
            );
        }
        insertedSupplierInvoice.setSupplierInvoiceProducts(supplierInvoiceProducts);
        insertedSupplierInvoice = supplierInvoiceRepository.save(insertedSupplierInvoice);
        SupplierInvoiceDto insertedSupplierInvoiceDto = new SupplierInvoiceDto();
        insertedSupplierInvoiceDto.setSupplierInvoiceId(insertedSupplierInvoice.getSupplierInvoiceId());
        insertedSupplierInvoiceDto.setSupplierId(insertedSupplierInvoice.getSupplierId());
        insertedSupplierInvoiceDto.setUserId(insertedSupplierInvoice.getUserId());
        List<InvoiceProductDto> invoiceProductDtos = new ArrayList<>();
        for(SupplierInvoiceProduct supplierInvoiceProduct : insertedSupplierInvoice.getSupplierInvoiceProducts()) {
            invoiceProductDtos.add(new InvoiceProductDto(supplierInvoiceProduct.getSupplierInvoice().getSupplierInvoiceId(), supplierInvoiceProduct.getProductId(), supplierInvoiceProduct.getQty().toPlainString()));
        }
        insertedSupplierInvoiceDto.setInvoiceProducts(invoiceProductDtos);
        return insertedSupplierInvoiceDto;
    }

    public List<SupplierInvoiceDto> getSupplierInvoices() {
        List<SupplierInvoice> supplierInvoices = supplierInvoiceRepository.findAll();
        List<SupplierInvoiceDto> supplierInvoiceDtos = new ArrayList<>();
        for(SupplierInvoice supplierInvoice : supplierInvoices) {
            SupplierInvoiceDto supplierInvoiceDto = new SupplierInvoiceDto();
            supplierInvoiceDto.setSupplierInvoiceId(supplierInvoice.getSupplierInvoiceId());
            supplierInvoiceDto.setSupplierId(supplierInvoice.getSupplierId());
            supplierInvoiceDto.setUserId(supplierInvoice.getUserId());
            supplierInvoiceDto.setInvoiceDate(new SimpleDateFormat("yyyy-MM-dd").format(supplierInvoice.getInvoiceDate()));
            List<InvoiceProductDto> invoiceProductDtos = new ArrayList<>();
            for(SupplierInvoiceProduct supplierInvoiceProduct : supplierInvoice.getSupplierInvoiceProducts()) {
                invoiceProductDtos.add(new InvoiceProductDto(supplierInvoiceProduct.getSupplierInvoice().getSupplierInvoiceId(), supplierInvoiceProduct.getProductId(), supplierInvoiceProduct.getQty().toPlainString()));
            }
            supplierInvoiceDto.setInvoiceProducts(invoiceProductDtos);
            supplierInvoiceDtos.add(supplierInvoiceDto);
        }
        return supplierInvoiceDtos;
    }

    public SupplierInvoiceDto deleteSupplierInvoice(Integer id) {
        try {
            supplierInvoiceRepository.deleteById(id);
            return new SupplierInvoiceDto(id, 0, 0, null, null);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }
}
