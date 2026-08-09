package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    boolean existsByName(String name);
    Category findById(int id);
    void deleteById(int id);

//    List<Category> findAllById(List<Integer> ids);
}
