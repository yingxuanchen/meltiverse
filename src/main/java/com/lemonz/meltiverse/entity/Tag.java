package com.lemonz.meltiverse.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Tag extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String label;
    private int useCount;

//    @OneToMany(mappedBy = "tag")
//    private List<MaterialTag> materialTags;
}
