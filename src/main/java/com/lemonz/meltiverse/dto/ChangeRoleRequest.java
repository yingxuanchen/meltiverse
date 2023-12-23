package com.lemonz.meltiverse.dto;

import lombok.Data;

@Data
public class ChangeRoleRequest {
    private String username;
    private Boolean isAdmin;
}
