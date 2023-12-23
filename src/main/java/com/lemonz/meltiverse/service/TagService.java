package com.lemonz.meltiverse.service;

import com.lemonz.meltiverse.dto.ITagMaterial;
import com.lemonz.meltiverse.dto.MaterialDto;
import com.lemonz.meltiverse.dto.MaterialTimestamp;
import com.lemonz.meltiverse.entity.Tag;
import com.lemonz.meltiverse.repository.MaterialTagRepository;
import com.lemonz.meltiverse.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepo;
    private final MaterialTagRepository materialTagRepo;

    public Page<Tag> getTags(String search, Pageable pageable) {
        return tagRepo.findByLabelContainingIgnoreCase(search, pageable);
    }

    public Tag getTag(Long id) {
        Tag tag = tagRepo.findById(id).orElse(null);
        if (tag == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return tag;
    }

    public Page<MaterialTimestamp> getMaterialTimestamps(Long tagId, String search, Pageable pageable) {
        Tag tag = tagRepo.findById(tagId).orElse(null);
        if (tag == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid tag id");
        }
        Page<ITagMaterial> tagMaterials = materialTagRepo.searchByTagIdAndKeyword(tagId, search, pageable);

        return tagMaterials.map(i -> {
                    String[] stringTimestamps = i.getTimestamps() == null ? new String[0] : i.getTimestamps().split(",");
                    Integer[] timestamps = Stream.of(stringTimestamps).map(Integer::valueOf).toArray(Integer[]::new);
                    return new MaterialTimestamp(
                            new MaterialDto(i.getMaterialId(), i.getPostedDate(), i.getAuthor(), i.getTitle(), i.getUrl(), i.getTopic()),
                            Arrays.asList(timestamps)
                    );
                }
        );
    }

    public void addTag(Tag tag) {
        if (tagRepo.existsTagByLabel(tag.getLabel())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag already exists");
        }
        tagRepo.save(tag);
    }

    public void editTag(Tag tag, Long id) {
        Tag existing = tagRepo.findById(id).orElse(null);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Tag other = tagRepo.findByLabelIgnoreCase(tag.getLabel());
        if (other != null && !other.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag already exists");
        }
        existing.setLabel(tag.getLabel());
        tagRepo.save(existing);
    }

    public void deleteTag(Long id) {
        tagRepo.deleteById(id);
    }

    public void updateTagUseCount() {
        tagRepo.updateTagUseCount();
    }
}
