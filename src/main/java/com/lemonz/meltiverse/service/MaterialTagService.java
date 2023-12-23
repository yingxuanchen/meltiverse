package com.lemonz.meltiverse.service;

import com.lemonz.meltiverse.dto.MaterialTagRequest;
import com.lemonz.meltiverse.entity.Material;
import com.lemonz.meltiverse.entity.MaterialTag;
import com.lemonz.meltiverse.entity.Nut;
import com.lemonz.meltiverse.entity.Tag;
import com.lemonz.meltiverse.repository.MaterialRepository;
import com.lemonz.meltiverse.repository.MaterialTagRepository;
import com.lemonz.meltiverse.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MaterialTagService {
    private final MaterialTagRepository materialTagRepo;
    private final MaterialRepository materialRepo;
    private final TagRepository tagRepo;


    private void validateRequest(MaterialTagRequest req) {
        Long materialId = req.getMaterialId();
        Long tagId = req.getTagId();

        if (materialId == null || tagId == null || materialRepo.findById(materialId).isEmpty() || tagRepo.findById(tagId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Must provide valid materialId and tagId");
        }
    }

    public void addMaterialTag(MaterialTagRequest req) {
        validateRequest(req);

        MaterialTag materialTag = new MaterialTag();

        Material material = new Material();
        material.setId(req.getMaterialId());
        materialTag.setMaterial(material);

        Tag tag = new Tag();
        tag.setId(req.getTagId());
        materialTag.setTag(tag);

        materialTag.setTimestamp(req.getTimestamp());

        materialTagRepo.save(materialTag);
    }

    public void editMaterialTag(MaterialTagRequest req, Long id) {
        validateRequest(req);

        MaterialTag materialTag = materialTagRepo.findById(id).orElse(null);
        if (materialTag == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        Material material = new Material();
        material.setId(req.getMaterialId());
        materialTag.setMaterial(material);

        Tag tag = new Tag();
        tag.setId(req.getTagId());
        materialTag.setTag(tag);

        materialTag.setTimestamp(req.getTimestamp());

        materialTagRepo.save(materialTag);
    }

    public void deleteMaterialTag(Long id) {
        materialTagRepo.deleteById(id);
    }

    public void checkIsAdminOrCreator(Long materialTagId, Nut user) {
        if (!user.getIsAdmin()) {
            MaterialTag materialTag = materialTagRepo.findById(materialTagId).orElse(null);
            if (materialTag == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
            if (!materialTag.getCreatedBy().equals(user.getId())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized access");
            }
        }
    }
}
