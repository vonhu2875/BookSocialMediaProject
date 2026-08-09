package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.CategoryRequest;
import com.vtbn.booksocial.dto.request.UpdateCategoryRequest;
import com.vtbn.booksocial.dto.response.ApiResponse;
import com.vtbn.booksocial.dto.response.CategoryResponse;
import com.vtbn.booksocial.entities.Category;
import com.vtbn.booksocial.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryRequest request) {
        var result = categoryService.createCategory(request);
        return ApiResponse.<CategoryResponse>builder().message("Add category success").result(result).build();
    }

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getCategories() {
        var result = categoryService.getCategories();
        return ApiResponse.<List<CategoryResponse>>builder().result(result).build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getCategory(@PathVariable int id) {
        var result = categoryService.getCategory(id);
        return ApiResponse.<CategoryResponse>builder().result(result).build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable int id, @RequestBody UpdateCategoryRequest request) {
        CategoryResponse result = categoryService.updateCategory(id, request);
        return ApiResponse.<CategoryResponse>builder().message("update category success").result(result).build();
//
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
        return ApiResponse.<Void>builder().message("delete category success").build();
    }
}
