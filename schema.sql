-- DROP TABLE material_tag;
-- DROP TABLE tag;
-- DROP TABLE material;
-- DROP TABLE nut;

CREATE TABLE nut (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    pw VARCHAR(20) NOT NULL,
    is_admin TINYINT DEFAULT 0 NOT NULL,
    contact VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE (username)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE material (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    posted_date DATE NOT NULL,
    author VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    topic VARCHAR(255),
    image_name VARCHAR(255),
    reviewed TINYINT DEFAULT 0 NOT NULL,
    created_by INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_by INT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL,
	PRIMARY KEY (id),
    FOREIGN KEY (created_by) REFERENCES nut(id),
    FOREIGN KEY (updated_by) REFERENCES nut(id)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE tag (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    label VARCHAR(255) NOT NULL,
    use_count INT UNSIGNED DEFAULT 0,
    created_by INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_by INT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (created_by) REFERENCES nut(id),
    FOREIGN KEY (updated_by) REFERENCES nut(id)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE material_tag (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    material_id INT UNSIGNED NOT NULL,
    tag_id INT UNSIGNED NOT NULL,
    time_stamp INT UNSIGNED,
    created_by INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_by INT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (material_id) REFERENCES material(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id),
    FOREIGN KEY (created_by) REFERENCES nut(id),
    FOREIGN KEY (updated_by) REFERENCES nut(id)
) DEFAULT CHARSET=utf8mb4;

-- ALTER TABLE tag CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- UPDATE tag
-- SET created_by = 1, updated_by = 1, created_at = CURRENT_TIMESTAMP(), updated_at = CURRENT_TIMESTAMP();

-- ALTER TABLE material_tag CHANGE time_seconds time_stamp INT UNSIGNED;

-- ALTER TABLE material
-- ADD COLUMN image_name VARCHAR(255);

-- ALTER TABLE material_tag
-- ADD FOREIGN KEY (updated_by) REFERENCES nut(id);

-- INSERT INTO nut (username,pw,is_admin) VALUES ('lemonade','881031',0);

-- ALTER TABLE nut
-- ADD UNIQUE (username);

-- DELETE FROM nut WHERE id > 2;