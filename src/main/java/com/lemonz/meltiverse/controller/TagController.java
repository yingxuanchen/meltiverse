package com.lemonz.meltiverse.controller;

import com.lemonz.meltiverse.dto.MaterialTimestamp;
import com.lemonz.meltiverse.entity.Tag;
import com.lemonz.meltiverse.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "tag")
public class TagController {
    private final TagService tagService;

    @GetMapping
    Page<Tag> getTags(
            @RequestParam(defaultValue = "") String search,
            @PageableDefault(sort = {"useCount", "id"}, direction = Sort.Direction.DESC, size = 10) Pageable pageable
    ) {
        return tagService.getTags(search, pageable);
    }

    @GetMapping("{id}")
    Tag getTag(@PathVariable Long id) {
        return tagService.getTag(id);
    }

    @GetMapping("{tagId}/material")
    Page<MaterialTimestamp> getMaterialTimestamps(
            @PathVariable Long tagId,
            @RequestParam(defaultValue = "") String search,
            @PageableDefault(sort = {"postedDate", "materialId"}, direction= Sort.Direction.DESC, size = 20) Pageable pageable
    ) {
        return tagService.getMaterialTimestamps(tagId, search, pageable);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    void addTag(@RequestBody Tag tag) {
        tagService.addTag(tag);
    }

    @PostMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    void editTag(@RequestBody Tag tag, @PathVariable Long id) {
        tagService.editTag(tag, id);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    void deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
    }

    @GetMapping("update-use-count")
    @PreAuthorize("hasRole('ADMIN')")
    void updateTagUseCount() {
        tagService.updateTagUseCount();
    }
}
