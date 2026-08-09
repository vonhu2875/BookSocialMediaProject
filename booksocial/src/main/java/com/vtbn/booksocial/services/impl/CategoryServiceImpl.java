package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.request.CategoryRequest;
import com.vtbn.booksocial.dto.request.UpdateCategoryRequest;
import com.vtbn.booksocial.dto.response.CategoryResponse;
import com.vtbn.booksocial.entities.Category;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.CategoryMapper;
import com.vtbn.booksocial.repositories.CategoryRepository;
import com.vtbn.booksocial.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        if(categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }
        Category category = categoryMapper.toCategory(request);
        categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    public List<CategoryResponse> getCategories() {
        List<Category> cates  = categoryRepository.findAll();
        return cates.stream().map(categoryMapper::toCategoryResponse).toList();
    }

    @Override
    public CategoryResponse getCategory(int id) {
        Category category = categoryRepository.findById(id);
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(int id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id);
        if (category == null)
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        if(request.getName() != null)
            category.setName(request.getName());
        if(request.getDescription() != null)
            category.setDescription(request.getDescription());
        categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    public void deleteCategory(int id) {
        if(categoryRepository.findById(id) == null)
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        categoryRepository.deleteById(id);
    }
}
