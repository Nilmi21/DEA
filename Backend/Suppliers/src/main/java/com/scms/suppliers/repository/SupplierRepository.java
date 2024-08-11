package com.scms.suppliers.repository;

import com.scms.suppliers.model.Supplier;
import org.springframework.data.repository.CrudRepository;

public interface SupplierRepository extends CrudRepository<Supplier, Long> {
}
