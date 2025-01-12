package com.securityModel.utils;


import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Random;

@Service
public class StorgeService {
    private final Path rootLocation = Paths.get("upload");
    private final Path filesLocation = Paths.get("upload/files");
    private final Path imagesLocation = Paths.get("upload/images");

    public StorgeService() {
        try {
            Files.createDirectories(rootLocation);
            Files.createDirectories(filesLocation);
            Files.createDirectories(imagesLocation);
        } catch (Exception e) {
            throw new RuntimeException("Could not initialize storage locations!", e);
        }
    }

    public String store(MultipartFile file, boolean isImage) {
        try {
            Path location = isImage ? imagesLocation : filesLocation;

            String fileName = Integer.toString(new Random().nextInt(1000000));
            String ext = file.getOriginalFilename().substring(file.getOriginalFilename().indexOf('.'));
            String name  = file.getOriginalFilename().substring(0, file.getOriginalFilename().indexOf('.'));
            String original = name + fileName + ext;
            Files.copy(file.getInputStream(), location.resolve(original));
            return original;

        } catch (Exception e) {
            throw new RuntimeException("FAIL!", e);
        }
    }

    public Resource loadFile(String filename, boolean isImage) {
        try {
            Path location = isImage ? imagesLocation : filesLocation;
            Path file = location.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("FAIL!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("FAIL!", e);
        }
    }
}
