package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.CategoryRequest;
import com.vtbn.booksocial.dto.response.CategoryResponse;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
}
