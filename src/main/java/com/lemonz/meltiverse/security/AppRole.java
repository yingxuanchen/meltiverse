package com.lemonz.meltiverse.security;

public enum AppRole {
    ROLE_USER("user"),
    ROLE_ADMIN("admin");

    public final String value;

    AppRole(String value) {
        this.value = value;
    }
}
