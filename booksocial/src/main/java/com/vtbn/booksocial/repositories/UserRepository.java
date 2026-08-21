package com.vtbn.booksocial.repositories;

import com.vtbn.booksocial.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

//Nhờ kế thừa JpaRepository, không cần tự viết các phương thức cơ bản.
//save()
//findById()
//findAll()
//delete()
//deleteById()
//count()
//existsById()
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    User findById(int id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findByEmail(String email);

}