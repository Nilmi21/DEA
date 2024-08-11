package com.scms.products.controller;

import com.scms.products.dto.DataReferenceElement;
import com.scms.products.models.Product;
import com.scms.products.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("listproducts")
    public ResponseEntity<List<Product>> listProductsHandler() {
        List<Product> products = productService.listProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("listproductsforreference")
    public ResponseEntity<List<DataReferenceElement>> createProduct() {
        List<DataReferenceElement> products = productService.listProductsForReference();
        return ResponseEntity.ok(products);
    }

    @PostMapping("addproduct")
    public ResponseEntity<Product> addProductHandler(@RequestBody Product product) {
        Product insertedProduct = productService.addProduct(product);
        if(insertedProduct != null) {
            return new ResponseEntity<>(insertedProduct, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("editproduct")
    public ResponseEntity<Product> editProductHandler(@RequestBody Product product) {
        Product insertedProduct = productService.editProduct(product);
        if(insertedProduct != null) {
            return new ResponseEntity<>(insertedProduct, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("deleteproduct")
    public ResponseEntity<Product> deleteProductHandler(@RequestBody Product product) {
        boolean success = productService.deleteProduct(product);
        if(success) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

}
