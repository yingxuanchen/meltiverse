package com.lemonz.meltiverse.repository;

import com.lemonz.meltiverse.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    boolean existsTagByLabel(String label);

    Tag findByLabelIgnoreCase(String label);

    Page<Tag> findByLabelContainingIgnoreCase(String label, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = """
            UPDATE tag
            SET use_count = (
                SELECT COUNT(id)
                FROM material_tag mt
                WHERE mt.tag_id = tag.id
            )""", nativeQuery = true)
    void updateTagUseCount();
}
