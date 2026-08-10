package com.vtbn.booksocial.specifications;

import com.vtbn.booksocial.entities.Book;
import com.vtbn.booksocial.enums.BookStatus;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class BookSpecification {
    public static Specification<Book> hasStatus(BookStatus status) {
        return (root, query,
                criteriaBuilder) ->criteriaBuilder.equal(root.get("status"),status);
    }

    public static Specification<Book> hasCategories(List<Integer> categoryIds) {
        return (root, query, criteriaBuilder) -> {
            if (categoryIds == null || categoryIds.isEmpty()) {
                return null;
            }
            // Tránh duplicate Book do ManyToMany JOIN
            query.distinct(true);
            return root.join("categories")
                    .get("id")
                    .in(categoryIds);
        };
    }

    public static Specification<Book> hasAuthor(int authorId) {
        return (root, query, criteriaBuilder) -> {
            if (authorId <= 0) {
                return null;
            }
            return criteriaBuilder.equal(
                    root.get("author").get("id"),
                    authorId
            );
        };
    }

    public static Specification<Book> containsKeyword(String keyword) {
            return (root, query, criteriaBuilder) -> {
                if (keyword == null || keyword.trim().isEmpty()) {
                    return null;
                }
                Expression<String> title =
                        criteriaBuilder.function(
                                "unaccent",
                                String.class,
                                root.get("title")
                        );

                Expression<String> normalizedTitle = criteriaBuilder.lower(title);
                Expression<String> normalizedKeyword =
                        criteriaBuilder.function(
                                "unaccent",
                                String.class,
                                criteriaBuilder.literal(
                                        keyword.trim().toLowerCase()
                                )
                        );

                return criteriaBuilder.like(
                        normalizedTitle,
                        criteriaBuilder.concat(
                                criteriaBuilder.concat(
                                        criteriaBuilder.literal("%"),
                                        normalizedKeyword
                                ),
                                criteriaBuilder.literal("%")
                        )
                );
            };
        };
    }