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
                throw new AppException(ErrorCode.AVATAR_UPLOAD_ERROR);
        }
    }
}
