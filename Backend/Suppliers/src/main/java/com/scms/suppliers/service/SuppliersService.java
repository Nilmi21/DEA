package com.scms.suppliers.service;

import com.scms.suppliers.dto.*;
import com.scms.suppliers.model.Supplier;
import com.scms.suppliers.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hibernate.validator.internal.util.Contracts.assertTrue;

@Service
public class SuppliersService {
    private final SupplierRepository supplierRepository;

    @Autowired
    public SuppliersService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public FormSubmitResponse addSupplier(String supplierName,String supplierMobile,String supplierAddress,Long userId){
        try{
            Supplier insertingSupplier = new Supplier();
            insertingSupplier.setSupplierName(supplierName);
            insertingSupplier.setSupplierMobile(supplierMobile);
            insertingSupplier.setSupplierAddress(supplierAddress);
            insertingSupplier.setUserId(userId);
            supplierRepository.save(insertingSupplier);
            return new FormSubmitResponse(new Message(true,"Supplier Successfully added."),null);
        }
        catch (Exception e){
            return new FormSubmitResponse(new Message(false,"Failed to add Supplier."), null);
        }

    }

    public FormSubmitResponse editSupplier(Long supplierId,String supplierName,String supplierMobile,String supplierAddress,Long userId){
        try{
                Optional<Supplier> supplierResult= supplierRepository.findById(supplierId);
                if(supplierResult.isPresent()){
                    Supplier supplier =supplierResult.get();
                    supplier.setSupplierName(supplierName);
                    supplier.setSupplierMobile(supplierMobile);
                    supplier.setSupplierAddress(supplierAddress);
                    supplier.setUserId(userId);
                    supplierRepository.save(supplier);
                    return new FormSubmitResponse(new Message(true,"Supplier successfully edited."),null);
                }else{
                    return new FormSubmitResponse(new Message(false,"Supplier not found."),null);
                }

        } catch (Exception e){
            return new FormSubmitResponse(new Message(false,"Failed to edit Supplier."),null);
        }
    }
    public FormSubmitResponse deleteSupplier(String supplierId) {
        try{
            Long parsedSupplierId = Long.parseLong(supplierId);
            Optional<Supplier> supplierResult = supplierRepository.findById(parsedSupplierId);
            if(supplierResult.isPresent()){
                Supplier supplier = supplierResult.get();
                supplierRepository.delete(supplier);
                return new FormSubmitResponse(new Message(true,"Supplier successfully deleted."),null);
            }else{
                return new FormSubmitResponse(new Message(false,"Supplier not found."),null);
            }
        }catch(NumberFormatException e){
            return new FormSubmitResponse(new Message(false,"invalid supplier ID format."),null);
        }catch(Exception e){
            return new FormSubmitResponse(new Message(false,"Failed to delete Supplier."),null);
        }
    }

    public ListSuppliersResponse listSuppliers(){
        try{
            List<SupplierDto> suppliers = new ArrayList<>();
            for(Supplier supplier : supplierRepository.findAll()){
                suppliers.add(new SupplierDto(supplier.getSupplierId(),supplier.getSupplierName(),supplier.getSupplierMobile(),supplier.getSupplierAddress(),supplier.getUserId()));

            }
            return new ListSuppliersResponse(suppliers);
        }catch (Exception e){
            return new ListSuppliersResponse(new ArrayList<>());
        }
    }

    public List<DataReferenceElement> listSuppliersForReference() {
        try {
            List<DataReferenceElement> suppliers = new ArrayList<>();
            for (Supplier supplier : supplierRepository.findAll()) {
                suppliers.add(new DataReferenceElement(supplier.getSupplierId(), supplier.getSupplierName()));
            }
            return suppliers;
        }
        catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
