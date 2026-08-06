package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.CategoryRequest;
import com.vtbn.booksocial.dto.response.ApiResponse;
import com.vtbn.booksocial.dto.response.CategoryResponse;
import com.vtbn.booksocial.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
