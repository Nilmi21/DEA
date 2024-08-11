package com.scms.products.service;

import com.scms.products.dto.DataReferenceElement;
import com.scms.products.models.Product;
import com.scms.products.repository.ProductRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(Product product) {
        try {
            product.setUserId(((Long)SecurityContextHolder.getContext().getAuthentication().getCredentials()).intValue());
            return productRepository.save(product);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public Product editProduct(Product product) {
        try {
            Optional<Product> result = productRepository.findById(product.getProductId());
            if(result.isPresent()) {
                Product existingProduct = result.get();
                existingProduct.setUserId(((Long)SecurityContextHolder.getContext().getAuthentication().getCredentials()).intValue());
                existingProduct.setSupplierId(product.getSupplierId());
                existingProduct.setProductDescription(product.getProductDescription());
                existingProduct.setReorderQuantity(product.getReorderQuantity());
                existingProduct.setQuantityAvailable(product.getQuantityAvailable());
                return productRepository.save(existingProduct);
            }
            else {
                throw new Exception("Product doesn't exist.");
            }
        }
        catch (Exception e) {
            return null;
        }
    }

    public boolean deleteProduct(Product product) {
        try {
            Optional<Product> result = productRepository.findById(product.getProductId());
            if(result.isPresent()) {
                Product existingProduct = result.get();
                productRepository.delete(existingProduct);
                return true;
            }
            else {
                throw new Exception("Product doesn't exist.");
            }
        }
        catch (Exception e) {
            return false;
        }
    }

    public List<Product> listProducts() {
        Iterable<Product> productIterable = productRepository.findAll();
        List<Product> products = new ArrayList<>();
        productIterable.forEach(products::add);
        return products;
    }

    public List<DataReferenceElement> listProductsForReference() {
        Iterable<Product> productIterable = productRepository.findAll();
        List<DataReferenceElement> products = new ArrayList<>();
        for(Product product : productIterable) {
            products.add(new DataReferenceElement(product.getProductId(), product.getProductDescription()));
        }
        return products;
    }

}
