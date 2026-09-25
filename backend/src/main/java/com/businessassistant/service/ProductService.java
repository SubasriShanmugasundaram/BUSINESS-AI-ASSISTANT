package com.businessassistant.service;

import com.businessassistant.dto.ProductDTO;
import com.businessassistant.entity.Product;
import com.businessassistant.exception.ResourceNotFoundException;
import com.businessassistant.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return toDTO(product);
    }

    public ProductDTO createProduct(ProductDTO dto) {
        Product product = new Product(
                dto.getName(),
                dto.getCategory(),
                dto.getSellingPrice(),
                dto.getPurchasePrice(),
                dto.getDescription()
        );
        Product saved = productRepository.save(product);
        return toDTO(saved);
    }

    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        product.setName(dto.getName());
        product.setCategory(dto.getCategory());
        product.setSellingPrice(dto.getSellingPrice());
        product.setPurchasePrice(dto.getPurchasePrice());
        product.setDescription(dto.getDescription());

        Product updated = productRepository.save(product);
        return toDTO(updated);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }

    public ProductDTO toDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getSellingPrice(),
                product.getPurchasePrice(),
                product.getDescription(),
                product.getCreatedAt()
        );
    }
}
