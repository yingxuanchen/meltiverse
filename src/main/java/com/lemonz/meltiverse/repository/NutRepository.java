package com.lemonz.meltiverse.repository;

import com.lemonz.meltiverse.entity.Nut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NutRepository extends JpaRepository<Nut, Long> {
    Nut findByUsername(String username);

    Nut findByUsernameAndPw(String username, String pw);
}
