package com.example.FurEverHome.S3;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String uploadFile(String fileName, MultipartFile file); // schimb ca inainte
}
