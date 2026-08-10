package com.vtbn.booksocial.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.services.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {
    private final Cloudinary cloudinary;
    @Override
    public String uploadFile(MultipartFile file, String folderName) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", folderName)
            );
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
                throw new AppException(ErrorCode.UPLOAD_FILE_ERROR);
        }
    }
    private String extractPublicId(String fileUrl) {
        String uploadMarker = "/upload/";

        int uploadIndex = fileUrl.indexOf(uploadMarker);

        if (uploadIndex == -1) {
            throw new AppException(ErrorCode.FILE_DELETE_ERROR);
        }

        String publicIdWithExtension =
                fileUrl.substring(uploadIndex + uploadMarker.length());

        // Bỏ version: v123456789/
        if (publicIdWithExtension.matches("v\\d+/.*")) {
            publicIdWithExtension =
                    publicIdWithExtension.substring(
                            publicIdWithExtension.indexOf("/") + 1
                    );
        }

        // Cloudinary public_id không bao gồm extension
        int extensionIndex = publicIdWithExtension.lastIndexOf(".");

        if (extensionIndex != -1) {
            publicIdWithExtension =
                    publicIdWithExtension.substring(0, extensionIndex);
        }

        return publicIdWithExtension;
    }
    @Override
    public void deleteFile(String fileUrl) {
        try{
            String publicId = extractPublicId(fileUrl);
            cloudinary.uploader().destroy(publicId,ObjectUtils.emptyMap());
        }
        catch(Exception e) {
            throw new AppException(ErrorCode.FILE_DELETE_ERROR);
        }
    }
}
