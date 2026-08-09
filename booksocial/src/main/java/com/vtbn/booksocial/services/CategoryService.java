package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.CategoryRequest;
import com.vtbn.booksocial.dto.request.UpdateCategoryRequest;
import com.vtbn.booksocial.dto.response.CategoryResponse;


import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    List<CategoryResponse> getCategories();
    CategoryResponse getCategory(int id);
    CategoryResponse updateCategory(int id, UpdateCategoryRequest request);
    void deleteCategory(int id);
}
