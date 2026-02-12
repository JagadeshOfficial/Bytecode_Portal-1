package com.bytecode.user.service;

import com.bytecode.user.model.User;
import com.bytecode.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(String id, User tempUser) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(tempUser.getFullName());
            user.setEmail(tempUser.getEmail());
            user.setRole(tempUser.getRole());
            user.setBranch(tempUser.getBranch());
            user.setActive(tempUser.isActive());
            if (tempUser.getPassword() != null && !tempUser.getPassword().isEmpty()) {
                user.setPassword(tempUser.getPassword());
            }
            if (tempUser.getPhoneNumber() != null && !tempUser.getPhoneNumber().isEmpty()) {
                user.setPhoneNumber(tempUser.getPhoneNumber());
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }
}
