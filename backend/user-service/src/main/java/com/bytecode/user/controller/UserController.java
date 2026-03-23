package com.bytecode.user.controller;

import com.bytecode.user.model.User;

import com.bytecode.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
// @CrossOrigin removed to avoid duplicate headers with Gateway
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers(@RequestParam(name = "role", required = false) String role) {
        if (role != null && !role.isEmpty()) {
            return userService.getUsersByRole(role);
        }
        return userService.getAllUsers();
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                     // Fallback check if ID might be an email for legacy clients
                     return userService.getUserByEmail(id)
                             .map(ResponseEntity::ok)
                             .orElse(ResponseEntity.notFound().build());
                });
    }

    // Explicit GET by email for clarity
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable("email") String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") String id, @RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, user));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
