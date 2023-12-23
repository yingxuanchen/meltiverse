package com.lemonz.meltiverse.dto;

import java.time.LocalDate;

public interface ITagMaterial {
    Long getMaterialId();

    LocalDate getPostedDate();

    String getAuthor();

    String getTitle();

    String getUrl();

    String getTopic();

    String getTimestamps();
}
