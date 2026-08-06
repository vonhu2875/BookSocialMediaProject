package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.request.CategoryRequest;
import com.vtbn.booksocial.dto.response.CategoryResponse;
import com.vtbn.booksocial.entities.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public Category toCategory(CategoryRequest request) {
        if(request == null)
            return null;
        return Category.builder().name(request.getName()).description(request.getDescription()).build();
    }

    public CategoryResponse toCategoryResponse(Category category) {
        if(category == null)
            return null;
        return CategoryResponse.builder().id(category.getId()).name(category.getName()).description(category.getDescription()).build();
    }

    public void updateCategory(Category category, CategoryRequest request) {
        if (category == null || request == null) {
            return;
        }
        category.setName(request.getName());
        category.setDescription(request.getDescription());
    }
}
