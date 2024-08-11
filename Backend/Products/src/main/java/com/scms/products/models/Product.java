package com.scms.products.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long productId;
    @Column(nullable = false)
    private String productDescription;
    @Column(name ="quantity_available" )
    private int quantityAvailable;
    private int reorderQuantity;
    private int supplierId;
    private int userId;
}
