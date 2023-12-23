package com.lemonz.meltiverse.controller;

import com.lemonz.meltiverse.dto.AuthRequest;
import com.lemonz.meltiverse.dto.ChangeRoleRequest;
import com.lemonz.meltiverse.dto.UserDto;
import com.lemonz.meltiverse.entity.Nut;
import com.lemonz.meltiverse.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("login")
    UserDto login(@RequestBody AuthRequest req) {
        return authService.login(req);
    }

    @PostMapping("signup")
    UserDto signup(@RequestBody AuthRequest req) {
        return authService.createUser(req);
    }

    @PostMapping("change-role")
    @PreAuthorize("hasRole('ADMIN')")
    void changeRole(@RequestBody ChangeRoleRequest req) {
        authService.changeRole(req);
    }

    @GetMapping("users")
    @PreAuthorize("hasRole('ADMIN')")
    List<Nut> getAllUsers() {
        return authService.getAllUsers();
    }
}
