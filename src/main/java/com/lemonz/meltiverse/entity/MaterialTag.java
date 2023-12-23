package com.lemonz.meltiverse.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MaterialTag extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", referencedColumnName = "id")
    private Tag tag;
    @Column(name = "time_stamp")
    private Integer timestamp;
}
