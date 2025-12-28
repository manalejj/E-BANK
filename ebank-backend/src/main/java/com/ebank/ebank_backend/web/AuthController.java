package com.ebank.ebank_backend.web;

import com.ebank.ebank_backend.dto.LoginRequest;
import com.ebank.ebank_backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    // We need to inject these to actually update the password
    private final InMemoryUserDetailsManager inMemoryUserDetailsManager;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            String token = jwtUtils.generateToken(authentication);
            return Map.of("token", token);
        } catch (Exception e) {
            throw new RuntimeException("Login ou mot de passe erronés");
        }
    }

    // REAL IMPLEMENTATION: Handle Password Change (UC-1)
    @PostMapping("/change-password")
    public void changePassword(@RequestBody Map<String, String> passwords) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String oldPassword = passwords.get("oldPassword");
        String newPassword = passwords.get("newPassword");

        // 1. Verify the old password matches
        UserDetails userDetails = inMemoryUserDetailsManager.loadUserByUsername(username);
        if (!passwordEncoder.matches(oldPassword, userDetails.getPassword())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        // 2. Create a new User object with the NEW encoded password
        // (InMemoryUserDetailsManager requires replacing the user to update password)
        UserDetails newUser = User.withUsername(username)
                .password(passwordEncoder.encode(newPassword))
                .authorities(userDetails.getAuthorities())
                .build();

        // 3. Update the user in the manager
        inMemoryUserDetailsManager.updateUser(newUser);

        System.out.println(">>> SUCCESS: Password actually updated for user [" + username + "]");
    }
}