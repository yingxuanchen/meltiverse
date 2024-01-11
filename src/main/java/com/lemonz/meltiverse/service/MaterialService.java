package com.lemonz.meltiverse.service;

import com.lemonz.meltiverse.dto.TagDto;
import com.lemonz.meltiverse.dto.TagTimestamp;
import com.lemonz.meltiverse.entity.Material;
import com.lemonz.meltiverse.entity.MaterialTag;
import com.lemonz.meltiverse.repository.MaterialRepository;
import com.lemonz.meltiverse.repository.MaterialTagRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialRepository materialRepo;
    private final MaterialTagRepository materialTagRepo;
    private final GoogleStorageService googleStorageService;

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

    public void validateFile(MultipartFile file) {
        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        List<String> allowedExt = List.of("png", "jpg", "jpeg");
        if (ext == null || !allowedExt.contains(ext.toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file type");
        }
    }

    /**
     * return saved file name with extension
     */
    public String saveFile(MultipartFile file, LocalDate postedDate) {
        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String fileName = generateFileName(postedDate);
        String fullFileName = fileName + "." + ext;
        try {
            googleStorageService.uploadFile(file, fullFileName);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to upload image");
        }
        return fullFileName;
    }

    private String generateFileName(LocalDate date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        return date.format(formatter) + "_" + RandomStringUtils.randomAlphanumeric(5);
    }

    public Long addMaterial(Material material) {
        Material saved = materialRepo.save(material);
        return saved.getId();
    }

    public Long editMaterial(Material existing, Material material) {
        existing.setPostedDate(material.getPostedDate());
        existing.setAuthor(material.getAuthor());
        existing.setTitle(material.getTitle());
        existing.setUrl(material.getUrl());
        existing.setTopic(material.getTopic());
        existing.setReviewed(material.getReviewed());
        existing.setImageName(material.getImageName());

        Material saved = materialRepo.save(existing);
        return saved.getId();
    }

    public void deleteMaterial(Long id) {
        if (materialTagRepo.existsMaterialTagByMaterialId(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete Material that has Tags");
        }
        materialRepo.deleteById(id);
    }
}
