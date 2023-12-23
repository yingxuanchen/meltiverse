package com.lemonz.meltiverse.dto;

import lombok.Data;

@Data
public class MaterialTagRequest {
    private Long id;
    private Long materialId;
    private Long tagId;
    private Integer timestamp;
}
