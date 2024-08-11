package com.scms.suppliers.api;

import com.scms.suppliers.dto.DataReferenceElement;
import com.scms.suppliers.dto.FormSubmitResponse;
import com.scms.suppliers.dto.ListSuppliersResponse;
import com.scms.suppliers.service.SuppliersService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {
    private final SuppliersService suppliersService;

    @Autowired
    public SupplierController(SuppliersService suppliersService) {
        this.suppliersService = suppliersService;
    }

    @PostMapping("addsupplier")
    public ResponseEntity<FormSubmitResponse> addSupplierHandler(
            @RequestParam("supplierName") @NotBlank String supplierName,
            @RequestParam("supplierMobile") @NotBlank String supplierMobile,
            @RequestParam("supplierAddress") @NotBlank String supplierAddress
    ) {
        FormSubmitResponse formSubmitResponse= suppliersService.addSupplier(supplierName,supplierMobile,supplierAddress,(Long)SecurityContextHolder.getContext().getAuthentication().getCredentials());
        return new ResponseEntity<>(formSubmitResponse, HttpStatus.OK);
    }

    @PostMapping("editsupplier")
    public ResponseEntity<FormSubmitResponse> editSupplierHandler(@RequestParam("supplierId") @NotBlank  String supplierId, @RequestParam("supplierName") @NotBlank String supplierName, @RequestParam("supplierMobile") @NotBlank String supplierMobile, @RequestParam("supplierAddress") @NotBlank String supplierAddress)
    {
        FormSubmitResponse formSubmitResponse = suppliersService.editSupplier(Long.parseLong(supplierId),supplierName,supplierMobile,supplierAddress,(Long)SecurityContextHolder.getContext().getAuthentication().getCredentials());
        return new ResponseEntity<>(formSubmitResponse,HttpStatus.OK);
    }

    @PostMapping("deletesupplier")
    public ResponseEntity<FormSubmitResponse> deleteSupplierHandler(@RequestParam("supplierId") @NotBlank String supplierId){
        FormSubmitResponse formSubmitResponse = suppliersService.deleteSupplier(supplierId);
        return new ResponseEntity<>(formSubmitResponse, HttpStatus.OK);

    }

    @GetMapping("listsuppliers")
    public ResponseEntity<ListSuppliersResponse> listSuppliersHandler(){
        ListSuppliersResponse listSuppliersResponse = suppliersService.listSuppliers();
        return new ResponseEntity<>(listSuppliersResponse,HttpStatus.OK);
    }

    @GetMapping("listsuppliersforreference")
    public ResponseEntity<List<DataReferenceElement>> listSuppliersForReferenceHandler(){
        List<DataReferenceElement> suppliers = suppliersService.listSuppliersForReference();
        return new ResponseEntity<>(suppliers,HttpStatus.OK);
    }
}
