package com.vtbn.booksocial.entities;

import com.vtbn.booksocial.enums.AuthProvider;
import com.vtbn.booksocial.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="users")
public class User extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, unique = true)
    private String username;
    private String password;
    @Column(nullable = false, unique = true)
    private String email;
    private String firstName;
    private String lastName;
    private String avatar;
    private boolean active;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider provider;
    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    private Set<Book> books;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<Bookshelf> bookShelfs;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<Rating> ratings;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<Comment> comments;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<AIChatHistory> aiChatHistories;
}


