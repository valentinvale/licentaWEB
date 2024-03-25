package com.example.FurEverHome.S3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;
import java.util.UUID;

@Service
public class S3Service implements FileService{

    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Autowired
    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    @Override
    public String uploadFile(String key, MultipartFile file) { // schimb ca inainte
        String extension = Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf("."));

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(file.getContentType());
        objectMetadata.setContentLength(file.getSize());

        try {
            amazonS3.putObject(bucketName, key, file.getInputStream(), objectMetadata);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to upload file", e);
        }
        amazonS3.setObjectAcl(bucketName, key, CannedAccessControlList.PublicRead);

        return String.format("https://%s.s3.amazonaws.com/%s", bucketName, key);
    }

    @Override
    public void deleteFile(String key) {
        try {
            amazonS3.deleteObject(bucketName, key);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to delete file", e);
        }
    }


}
