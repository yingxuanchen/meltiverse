package com.lemonz.meltiverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MaterialTimestamp {
    private MaterialDto material;
    private List<Integer> timestamps;
}
