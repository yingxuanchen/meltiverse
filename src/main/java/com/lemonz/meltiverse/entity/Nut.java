package com.lemonz.meltiverse.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Nut {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String username;
    private String pw;
    private Boolean isAdmin = false;
    private String contact;
}
