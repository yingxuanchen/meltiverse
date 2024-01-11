package com.lemonz.meltiverse.controller;

import com.lemonz.meltiverse.dto.TagTimestamp;
import com.lemonz.meltiverse.entity.Material;
import com.lemonz.meltiverse.service.GoogleStorageService;
import com.lemonz.meltiverse.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "api/material")
public class MaterialController {
    private final MaterialService materialService;
    private final GoogleStorageService googleStorageService;

    @GetMapping
    Page<Material> getMaterials(
            @RequestParam(defaultValue = "") String search,
            @PageableDefault(sort = {"postedDate", "id"}, direction = Sort.Direction.DESC, size = 10) Pageable pageable
    ) {
        return materialService.getMaterials(search, pageable);
    }

    @GetMapping("{id}")
    Material getMaterial(@PathVariable Long id) {
        return materialService.getMaterial(id);
    }

    @GetMapping("{materialId}/tag")
    Page<TagTimestamp> getTagTimestamps(
            @PathVariable Long materialId,
            @RequestParam(defaultValue = "") String search,
            @PageableDefault(sort = {"timestamp", "id"}, size = 10) Pageable pageable
    ) {
        return materialService.getTagTimestamps(materialId, search, pageable);
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("isAuthenticated()")
    Long addMaterial(@RequestPart Material material, @RequestPart(required = false) MultipartFile file) {
        if (file != null) {
            materialService.validateFile(file);
            String fileName = materialService.saveFile(file, material.getPostedDate());
            material.setImageName(fileName);
        }
        return materialService.addMaterial(material);
    }

    @PostMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    Long editMaterial(
            @RequestPart Material material,
            @RequestPart(required = false) MultipartFile file,
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean delete
    ) {
        Material existing = materialService.getMaterial(id);
        if (file != null) {
            materialService.validateFile(file);
            String fileName = materialService.saveFile(file, material.getPostedDate());
            material.setImageName(fileName);
            if (existing.getImageName() != null) {
                googleStorageService.deleteFile(existing.getImageName());
            }
        } else if (delete && existing.getImageName() != null) {
            googleStorageService.deleteFile(existing.getImageName());
        } else {
            material.setImageName(existing.getImageName());
        }
        return materialService.editMaterial(existing, material);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    void deleteMaterial(@PathVariable Long id) {
        Material material = materialService.getMaterial(id);
        materialService.deleteMaterial(id);
        if (material.getImageName() != null) {
            googleStorageService.deleteFile(material.getImageName());
        }
    }
}
