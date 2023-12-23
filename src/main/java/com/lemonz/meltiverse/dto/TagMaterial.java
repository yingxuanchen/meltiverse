package com.lemonz.meltiverse.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TagMaterial {
    private Long materialId;
    private LocalDate postedDate;
    private String author;
    private String title;
    private String url;
    private String topic;
    private String timestamps;

//    public MaterialDto getMaterialDto() {
//        MaterialDto dto = new MaterialDto();
//        dto.setId(this.getMaterialId());
//        dto.setPostedDate(this.getPostedDate());
//        dto.setAuthor(this.getAuthor());
//        dto.setTitle(this.getTitle());
//        dto.setUrl(this.getUrl());
//        dto.setTopic(this.getTopic());
//        return dto;
//    }
}
