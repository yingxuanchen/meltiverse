package com.lemonz.meltiverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDto {
    private Long userId;
    private String username;
    private String role;
    private String jwt;
}
