SELECT * FROM meltiverse.material;
SELECT * FROM meltiverse.tag ORDER BY use_count DESC, id DESC;
SELECT * FROM meltiverse.material_tag;
SELECT * FROM meltiverse.nut;

SELECT mt.material_id, m.posted_date, m.author, m.title, m.url, m.topic, GROUP_CONCAT(time_stamp SEPARATOR ', ') timestamps
                FROM material_tag mt
                INNER JOIN material m ON m.id = mt.material_id
                WHERE mt.tag_id = 32
                AND (
                    lower(m.posted_date) LIKE lower(concat('%', '2023', '%'))
                    OR lower(m.author) LIKE lower(concat('%', '2023', '%'))
                    OR lower(m.title) LIKE lower(concat('%', '2023', '%'))
                    OR lower(m.topic) LIKE lower(concat('%', '2023', '%'))
                )
                GROUP BY mt.material_id, m.posted_date, m.author, m.title, m.url, m.topic;


                
-- UPDATE tag
-- SET use_count = (
-- 	SELECT COUNT(id)
--     FROM material_tag mt
--     WHERE mt.tag_id = tag.id
-- );
