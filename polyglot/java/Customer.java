package com.demoshop.customers;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Customer {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String cnic;
    private String iban;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getCnic() { return cnic; }
    public String getIban() { return iban; }
}
