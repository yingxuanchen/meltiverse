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
                WHERE (m.author LIKE concat('%', :search, '%')
                OR m.title LIKE concat('%', :search, '%')
                OR m.topic LIKE concat('%', :search, '%'))
                OR DATE_FORMAT(m.postedDate, '%Y-%m-%d') LIKE concat('%', :search, '%')
            """)
    Page<Material> searchByAuthorTitleTopic(@Param("search") String search, Pageable pageable);
}
