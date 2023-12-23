package com.lemonz.meltiverse.controller;

import com.lemonz.meltiverse.dto.MaterialTagRequest;
import com.lemonz.meltiverse.entity.MaterialTag;
import com.lemonz.meltiverse.entity.Nut;
import com.lemonz.meltiverse.service.MaterialTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "material-tag")
public class MaterialTagController {
    private final MaterialTagService materialTagService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    void addMaterialTag(@RequestBody MaterialTagRequest req) {
        materialTagService.addMaterialTag(req);
    }

    @PostMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    void editMaterialTag(@RequestBody MaterialTagRequest req, @PathVariable Long id, @AuthenticationPrincipal Nut user) {
        materialTagService.checkIsAdminOrCreator(id, user);
        materialTagService.editMaterialTag(req, id);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    void deleteMaterialTag(@PathVariable Long id, @AuthenticationPrincipal Nut user) {
        materialTagService.checkIsAdminOrCreator(id, user);
        materialTagService.deleteMaterialTag(id);
    }
}
