package com.lemonz.meltiverse.service;

import com.lemonz.meltiverse.dto.AuthRequest;
import com.lemonz.meltiverse.dto.ChangeRoleRequest;
import com.lemonz.meltiverse.dto.UserDto;
import com.lemonz.meltiverse.entity.Nut;
import com.lemonz.meltiverse.repository.NutRepository;
import com.lemonz.meltiverse.security.AppRole;
import com.lemonz.meltiverse.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final NutRepository nutRepo;
    private final JwtUtils jwtUtils;

    public UserDto login(AuthRequest req) {
        Nut nut = nutRepo.findByUsernameAndPw(req.getUsername(), req.getPw());
        if (nut == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid credentials");
        }

        String jwt = jwtUtils.generateJwt(nut.getUsername());
        AppRole role = nut.getIsAdmin() ? AppRole.ROLE_ADMIN : AppRole.ROLE_USER;
        return new UserDto(nut.getId(), nut.getUsername(), role.value, jwt);
    }

    public UserDto createUser(AuthRequest req) {
        Nut existing = nutRepo.findByUsername(req.getUsername());
        if (existing != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists. Please choose another one.");
        }
        Nut nut = new Nut();
        nut.setUsername(req.getUsername());
        nut.setPw(req.getPw());
        nut.setContact(req.getContact());
        nutRepo.save(nut);

        String jwt = jwtUtils.generateJwt(nut.getUsername());
        return new UserDto(nut.getId(), nut.getUsername(), AppRole.ROLE_USER.value, jwt);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void changeRole(ChangeRoleRequest req) {
        Nut nut = nutRepo.findByUsername(req.getUsername());
        if (nut == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid username");
        }
        nut.setIsAdmin(req.getIsAdmin());
        nutRepo.save(nut);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<Nut> getAllUsers() {
        return nutRepo.findAll();
    }
}
