package com.elearn.lms.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.elearn.lms.dto.CategoryDTO;
import com.elearn.lms.entity.Category;
import com.elearn.lms.repository.CategoryRepository;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    /**
     * Get all categories
     * @return List of CategoryDTO
     */
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get category by ID
     * @param id Category ID
     * @return CategoryDTO if found, otherwise null
     */
    public CategoryDTO getCategoryById(Long id) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        return categoryOpt.map(this::convertToDTO).orElse(null);
    }
    
    /**
     * Create a new category
     * @param categoryDTO Category data
     * @return Created CategoryDTO
     */
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = convertToEntity(categoryDTO);
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }
    
    /**
     * Update an existing category
     * @param id Category ID
     * @param categoryDTO Updated category data
     * @return Updated CategoryDTO if found, otherwise null
     */
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            category.setName(categoryDTO.getName());
            category.setDescription(categoryDTO.getDescription());
            category.setUpdatedAt(LocalDateTime.now());
            Category updatedCategory = categoryRepository.save(category);
            return convertToDTO(updatedCategory);
        }
        return null;
    }
    
    /**
     * Delete a category by ID
     * @param id Category ID
     * @return true if deleted, false if not found
     */
    public boolean deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Convert Category entity to CategoryDTO
     * @param category Category entity
     * @return CategoryDTO
     */
    private CategoryDTO convertToDTO(Category category) {
        return new CategoryDTO(
                category.getCategoryId(),
                category.getName(),
                category.getDescription(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
    
    /**
     * Convert CategoryDTO to Category entity
     * @param categoryDTO CategoryDTO
     * @return Category entity
     */
    private Category convertToEntity(CategoryDTO categoryDTO) {
        return new Category(
                categoryDTO.getCategoryId(),
                categoryDTO.getName(),
                categoryDTO.getDescription(),
                categoryDTO.getCreatedAt(),
                categoryDTO.getUpdatedAt()
        );
    }
}
