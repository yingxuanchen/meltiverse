package com.lemonz.meltiverse.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class MaterialDto {
    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate postedDate;
    private String author;
    private String title;
    private String url;
    private String topic;
}
