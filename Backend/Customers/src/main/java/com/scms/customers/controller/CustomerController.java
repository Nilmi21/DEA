package com.scms.customers.controller;

import com.scms.customers.data.Customer;
import com.scms.customers.dto.UserDto;
import com.scms.customers.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CustomerController {

    private final com.scms.customers.repositories.CustomerRepository CustomerRepository;
    @Autowired
    public CustomerController(CustomerRepository customerRepository) {
        this.CustomerRepository = customerRepository;
    }
    @GetMapping("/customers")
    public List<Customer> customers(){
        return CustomerRepository.findAll();
    }

    @GetMapping("/customer/{id}")
    public Customer customer(@PathVariable int id){
        return CustomerRepository.findById(id).orElse(null);
    }
    @PostMapping("/customer/create")
    public Customer createCustomer(
            @RequestParam("customerName") String customerName,
            @RequestParam("mobileNumber") String mobileNumber,
            @RequestParam("address") String address
    ){
        Customer customer = new Customer();
        customer.setCustomerName(customerName);
        customer.setMobileNumber(Integer.parseInt(mobileNumber));
        customer.setAddress(address);
        customer.setUser_id(((Long)SecurityContextHolder.getContext().getAuthentication().getCredentials()).intValue());
        return CustomerRepository.save(customer);
    }


    @PutMapping("/customer/update")
    public Customer updateCustomer(
            @RequestParam("customerName") String customerName,
            @RequestParam("mobileNumber") String mobileNumber,
            @RequestParam("address") String address,
            @RequestParam("customerId") String customerId
    ){
        Customer existingCustomer = CustomerRepository.findById(Integer.parseInt(customerId)).orElse(null);
        if(existingCustomer != null){
            existingCustomer.setCustomerName(customerName);
            existingCustomer.setMobileNumber(Integer.parseInt(mobileNumber));
            existingCustomer.setAddress(address);
            existingCustomer.setUser_id(((Long)SecurityContextHolder.getContext().getAuthentication().getCredentials()).intValue());
            return CustomerRepository.save(existingCustomer);
        }
        return null;
    }
    @DeleteMapping("/customer/delete")
    public Customer deleteCustomer(@RequestParam("customerId") String customerId){
        Customer existingCustomer = CustomerRepository.findById(Integer.parseInt(customerId)).orElse(null);
        if(existingCustomer != null){
            CustomerRepository.delete(existingCustomer);
        }
        return existingCustomer;
    }
}
