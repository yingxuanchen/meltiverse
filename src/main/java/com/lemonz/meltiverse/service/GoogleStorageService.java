package com.lemonz.meltiverse.service;

import com.google.api.gax.paging.Page;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class GoogleStorageService {

    @Value("${gcp.bucket.name}")
    private String bucketName;

    @Autowired
    Storage storage;

    public List<String> listFiles() {
        List<String> list = new ArrayList<>();
        Page<Blob> blobs = storage.list(bucketName);
        for (Blob blob : blobs.iterateAll()) {
            list.add(blob.getName());
        }
        return list;
    }

    public ByteArrayResource downloadFile(String fileName) {
        Blob blob = storage.get(bucketName, fileName);
        return new ByteArrayResource(blob.getContent());
    }

    public boolean deleteFile(String fileName) {
        Blob blob = storage.get(bucketName, fileName);
        return blob.delete();
    }

    public void uploadFile(MultipartFile file, String fileName) throws IOException {
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).
                setContentType(file.getContentType()).build();
        storage.create(blobInfo, file.getBytes());
    }
}
