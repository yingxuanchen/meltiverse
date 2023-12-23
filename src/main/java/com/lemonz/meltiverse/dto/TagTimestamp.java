package com.lemonz.meltiverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TagTimestamp {
    private Long id;
    private TagDto tag;
    private Integer timestamp;
    private Long createdBy;
}
