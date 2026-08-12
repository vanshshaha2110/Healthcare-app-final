package com.healthbot.controller;

import com.healthbot.entity.Doctor;
import com.healthbot.entity.Document;
import com.healthbot.repository.DoctorRepository;
import com.healthbot.repository.DocumentRepository;
import com.healthbot.service.DocumentAnalysisResponse;
import com.healthbot.service.PythonAiClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final PythonAiClient pythonAiClient;
    private final DocumentRepository documentRepository;
    private final DoctorRepository doctorRepository;

    public DocumentController(PythonAiClient pythonAiClient,
                              DocumentRepository documentRepository,
                              DoctorRepository doctorRepository) {
        this.pythonAiClient = pythonAiClient;
        this.documentRepository = documentRepository;
        this.doctorRepository = doctorRepository;
    }

    @PostMapping("/upload")
    public Document uploadAndAnalyze(@RequestParam(name = "file") MultipartFile file,
                                      @RequestParam(name = "documentType") String documentType) {

        DocumentAnalysisResponse analysis = pythonAiClient.analyzeDocument(file, documentType);

        String extractedText = analysis != null && analysis.getExtractedText() != null ? analysis.getExtractedText() : "";
        String aiSummary = analysis != null && analysis.getAiSummary() != null ? analysis.getAiSummary() : "";

        if (analysis != null && analysis.getDoctor() != null) {
            DocumentAnalysisResponse.DoctorInfo docInfo = analysis.getDoctor();
            String docName = docInfo.getName();

            if (docName != null && !docName.isBlank() && !docName.equalsIgnoreCase("null") && !docName.toLowerCase().contains("not found")) {
                docName = docName.trim();
                if (!docName.toLowerCase().startsWith("dr.")) {
                    docName = "Dr. " + docName;
                }

                String specialty = (docInfo.getSpecialty() != null && !docInfo.getSpecialty().isBlank() && !docInfo.getSpecialty().equalsIgnoreCase("null"))
                        ? docInfo.getSpecialty().trim() : "General Physician";
                String hospital = (docInfo.getHospital() != null && !docInfo.getHospital().isBlank() && !docInfo.getHospital().equalsIgnoreCase("null"))
                        ? docInfo.getHospital().trim() : "Clinic / Hospital";
                String city = (docInfo.getCity() != null && !docInfo.getCity().isBlank() && !docInfo.getCity().equalsIgnoreCase("null"))
                        ? docInfo.getCity().trim() : "Mumbai";
                String contact = (docInfo.getContact() != null && !docInfo.getContact().isBlank() && !docInfo.getContact().equalsIgnoreCase("null"))
                        ? docInfo.getContact().trim() : "+91 98000 11223";

                Optional<Doctor> existingDocOpt = doctorRepository.findFirstByNameContainingIgnoreCase(docName.replace("Dr. ", ""));
                Doctor savedDoctor;
                if (existingDocOpt.isPresent()) {
                    savedDoctor = existingDocOpt.get();
                    if (hospital != null && !hospital.contains("null") && !hospital.contains("Clinic / Hospital")) savedDoctor.setHospital(hospital);
                    if (city != null && !city.contains("null")) savedDoctor.setCity(city);
                    if (contact != null && !contact.contains("null") && !contact.contains("98000")) savedDoctor.setContact(contact);
                    savedDoctor = doctorRepository.save(savedDoctor);
                    aiSummary += "\n\n👨‍⚕️ Prescription Doctor Updated in Dataset: " + savedDoctor.getName() + " (" + savedDoctor.getSpecialty() + " at " + savedDoctor.getHospital() + ", " + savedDoctor.getCity() + ")";
                } else {
                    Doctor newDoc = new Doctor();
                    newDoc.setName(docName);
                    newDoc.setSpecialty(specialty);
                    newDoc.setHospital(hospital);
                    newDoc.setCity(city);
                    newDoc.setRating(new BigDecimal("4.8"));
                    newDoc.setContact(contact);
                    savedDoctor = doctorRepository.save(newDoc);
                    aiSummary += "\n\n✨ New Doctor Extracted & Added to Dataset: " + savedDoctor.getName() + " (" + savedDoctor.getSpecialty() + " at " + savedDoctor.getHospital() + ", " + savedDoctor.getCity() + ")";
                }
            }
        }

        Document doc = new Document();
        doc.setUserId(1L);
        doc.setFileName(file != null && file.getOriginalFilename() != null ? file.getOriginalFilename() : "uploaded_document");
        doc.setDocumentType(documentType != null ? documentType : "PRESCRIPTION");
        doc.setExtractedText(extractedText);
        doc.setAiSummary(aiSummary);

        return documentRepository.save(doc);
    }

    @GetMapping
    public List<Document> getMyDocuments() {
        return documentRepository.findByUserIdOrderByUploadedAtDesc(1L);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        documentRepository.deleteById(id);
    }
}
