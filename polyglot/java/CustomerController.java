package com.demoshop.customers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    public record CustomerSummary(Long id, String name) {}

    private final CustomerRepository repository;

    public CustomerController(CustomerRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<CustomerSummary> summary(@PathVariable Long id) {
        return repository.findById(id)
                .map(c -> ResponseEntity.ok(new CustomerSummary(c.getId(), c.getName())))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> details(@PathVariable Long id) {
        Customer customer = repository.findById(id).orElseThrow();
        return ResponseEntity.ok(customer);
    }
}
