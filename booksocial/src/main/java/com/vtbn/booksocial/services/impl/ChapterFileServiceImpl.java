package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.services.ChapterFileService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ChapterFileServiceImpl implements ChapterFileService {
    @Override
    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty())
            throw new AppException(ErrorCode.CHAPTER_FILE_REQUIRED);
        String fileName = file.getOriginalFilename();
        if (fileName == null)
            throw new AppException(ErrorCode.INVALID_CHAPTER_FILE);
        String lowerFileName = fileName.toLowerCase();
        try {
            if (lowerFileName.endsWith(".pdf")) {
                return extractPdf(file);
            }
            if (lowerFileName.endsWith(".docx")) {
                return extractDocx(file);
            }

            throw new AppException(ErrorCode.INVALID_CHAPTER_FILE);

        } catch (IOException e) {
            throw new AppException(ErrorCode.CHAPTER_FILE_READ_FAILED);
        }
    }
    private String extractPdf(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
    private String extractDocx(MultipartFile file)throws IOException {
        try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
            StringBuilder content = new StringBuilder();

            for (XWPFParagraph paragraph : document.getParagraphs()) {
                content.append(paragraph.getText());
                content.append("\n");
            }
            return content.toString();
        }
    }
}
