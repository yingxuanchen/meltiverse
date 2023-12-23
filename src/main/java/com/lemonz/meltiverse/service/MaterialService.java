package com.lemonz.meltiverse.service;

import com.lemonz.meltiverse.dto.TagDto;
import com.lemonz.meltiverse.dto.TagTimestamp;
import com.lemonz.meltiverse.entity.Material;
import com.lemonz.meltiverse.entity.MaterialTag;
import com.lemonz.meltiverse.repository.MaterialRepository;
import com.lemonz.meltiverse.repository.MaterialTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialRepository materialRepo;
    private final MaterialTagRepository materialTagRepo;

    public Page<Material> getMaterials(String search, Pageable pageable) {
        return materialRepo.searchByAuthorTitleTopic(search, pageable);
    }

    public Material getMaterial(Long id) {
        Material material = materialRepo.findById(id).orElse(null);
        if (material == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return material;
    }

    public Page<TagTimestamp> getTagTimestamps(Long materialId, String search, Pageable pageable) {
        Material material = materialRepo.findById(materialId).orElse(null);
        if (material == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid material id");
        }
        Page<MaterialTag> materialTags = materialTagRepo.searchByMaterialIdAndTagLabel(materialId, search, pageable);

        return materialTags.map(materialTag ->
                new TagTimestamp(
                        materialTag.getId(),
                        new TagDto(materialTag.getTag().getId(), materialTag.getTag().getLabel()),
                        materialTag.getTimestamp(),
                        materialTag.getCreatedBy()
                )
        );
    }

    public Long addMaterial(Material material) {
        Material saved = materialRepo.save(material);
        return saved.getId();
    }

    public Long editMaterial(Material material, Long id) {
        Material existing = materialRepo.findById(id).orElse(null);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        material.setId(id);
        Material saved = materialRepo.save(material);
        return saved.getId();
    }

    public void deleteMaterial(Long id) {
        if (materialTagRepo.existsMaterialTagByMaterialId(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete Material that has Tags");
        }
        materialRepo.deleteById(id);
    }
}
