package com.lemonz.meltiverse.controller;

import com.lemonz.meltiverse.dto.TagTimestamp;
import com.lemonz.meltiverse.entity.Material;
import com.lemonz.meltiverse.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "api/material")
public class MaterialController {
    private final MaterialService materialService;

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

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    Long addMaterial(@RequestBody Material material) {
        return materialService.addMaterial(material);
    }

    @PostMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    Long editMaterial(@RequestBody Material material, @PathVariable Long id) {
        return materialService.editMaterial(material, id);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    void deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
    }
}
