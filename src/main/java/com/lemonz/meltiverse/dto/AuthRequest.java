package com.lemonz.meltiverse.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String pw;
    private String contact;
}
