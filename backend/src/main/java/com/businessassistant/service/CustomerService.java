package com.businessassistant.service;

import com.businessassistant.dto.CustomerDTO;
import com.businessassistant.entity.Customer;
import com.businessassistant.exception.ResourceNotFoundException;
import com.businessassistant.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CustomerDTO> searchCustomers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllCustomers();
        }
        String q = query.trim().toLowerCase();
        return customerRepository.findAll().stream()
                .filter(c -> (c.getName() != null && c.getName().toLowerCase().contains(q)) ||
                             (c.getPhone() != null && c.getPhone().contains(q)) ||
                             (c.getEmail() != null && c.getEmail().toLowerCase().contains(q)))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        return toDTO(customer);
    }

    public CustomerDTO createCustomer(CustomerDTO dto) {
        Customer customer = new Customer(
                dto.getName(),
                dto.getPhone(),
                dto.getEmail(),
                dto.getAddress()
        );
        Customer saved = customerRepository.save(customer);
        return toDTO(saved);
    }

    public CustomerDTO updateCustomer(Long id, CustomerDTO dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        customer.setName(dto.getName());
        customer.setPhone(dto.getPhone());
        customer.setEmail(dto.getEmail());
        customer.setAddress(dto.getAddress());

        Customer updated = customerRepository.save(customer);
        return toDTO(updated);
    }

    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with ID: " + id);
        }
        customerRepository.deleteById(id);
    }

    public CustomerDTO toDTO(Customer customer) {
        return new CustomerDTO(
                customer.getId(),
                customer.getName(),
                customer.getPhone(),
                customer.getEmail(),
                customer.getAddress(),
                customer.getCreatedAt()
        );
    }
}
