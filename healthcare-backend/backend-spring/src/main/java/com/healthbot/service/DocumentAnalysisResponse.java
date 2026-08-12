package com.healthbot.service;

public class DocumentAnalysisResponse {
    private String extractedText;
    private String aiSummary;
    private String documentType;
    private DoctorInfo doctor;

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }
    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }
    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    public DoctorInfo getDoctor() { return doctor; }
    public void setDoctor(DoctorInfo doctor) { this.doctor = doctor; }

    public static class DoctorInfo {
        private String name;
        private String specialty;
        private String city;
        private String hospital;
        private String contact;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSpecialty() { return specialty; }
        public void setSpecialty(String specialty) { this.specialty = specialty; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getHospital() { return hospital; }
        public void setHospital(String hospital) { this.hospital = hospital; }
        public String getContact() { return contact; }
        public void setContact(String contact) { this.contact = contact; }
    }
}
