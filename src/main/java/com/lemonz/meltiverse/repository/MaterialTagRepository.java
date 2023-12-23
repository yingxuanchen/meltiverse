package com.lemonz.meltiverse.repository;

import com.lemonz.meltiverse.dto.ITagMaterial;
import com.lemonz.meltiverse.dto.TagMaterial;
import com.lemonz.meltiverse.entity.MaterialTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialTagRepository extends JpaRepository<MaterialTag, Long> {
    @Query("""
                SELECT mt FROM MaterialTag mt
                WHERE mt.material.id = :materialId
                AND lower(mt.tag.label) LIKE lower(concat('%', :label, '%'))
            """)
    Page<MaterialTag> searchByMaterialIdAndTagLabel(@Param("materialId") Long materialId, @Param("label") String label, Pageable pageable);

    @Query(value = """
                SELECT mt.material_id AS materialId, m.posted_date AS postedDate, m.author, m.title, m.url, m.topic, GROUP_CONCAT(time_stamp SEPARATOR ',') timestamps
                FROM material_tag mt
                INNER JOIN material m ON m.id = mt.material_id
                WHERE mt.tag_id = :tagId
                AND (
                    lower(m.posted_date) LIKE lower(concat('%', :keyword, '%'))
                    OR lower(m.author) LIKE lower(concat('%', :keyword, '%'))
                    OR lower(m.title) LIKE lower(concat('%', :keyword, '%'))
                    OR lower(m.topic) LIKE lower(concat('%', :keyword, '%'))
                )
                GROUP BY mt.material_id, m.posted_date, m.author, m.title, m.url, m.topic
            """, nativeQuery = true)
    Page<ITagMaterial> searchByTagIdAndKeyword(@Param("tagId") Long tagId, @Param("keyword") String keyword, Pageable pageable);

    List<MaterialTag> findByTagId(Long tagId);

    boolean existsMaterialTagByMaterialId(Long materialId);
}
