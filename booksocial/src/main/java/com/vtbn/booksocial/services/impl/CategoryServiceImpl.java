package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.request.CategoryRequest;
import com.vtbn.booksocial.dto.response.CategoryResponse;
import com.vtbn.booksocial.entities.Category;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.CategoryMapper;
import com.vtbn.booksocial.repositories.CategoryRepository;
import com.vtbn.booksocial.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
