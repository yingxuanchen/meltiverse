package com.lemonz.meltiverse.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Material extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "posted_date")
    private LocalDate postedDate;
    private String author;
    private String title;
    private String url;
    private String topic;
    private Boolean reviewed = false;

    //    @OneToMany(mappedBy = "material")
//    private List<MaterialTag> materialTags;

}
