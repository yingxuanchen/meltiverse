package com.lemonz.meltiverse.repository;

import com.lemonz.meltiverse.entity.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    @Query("""
                SELECT m FROM Material m
                WHERE lower(m.author) LIKE lower(concat('%', :search, '%'))
                OR lower(m.title) LIKE lower(concat('%', :search, '%'))
                OR lower(m.topic) LIKE lower(concat('%', :search, '%'))
                OR m.postedDate LIKE concat('%', :search, '%')
            """)
    Page<Material> searchByAuthorTitleTopic(@Param("search") String search, Pageable pageable);
}
