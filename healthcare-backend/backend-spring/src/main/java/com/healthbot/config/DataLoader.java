package com.healthbot.config;

import com.healthbot.entity.Doctor;
import com.healthbot.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final DoctorRepository doctorRepository;

    public DataLoader(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public void run(String... args) {
        if (doctorRepository.count() == 0) {
            List<Doctor> dataset = List.of(
                // --- DENTIST & DENTAL SPECIALISTS ---
                createDoctor("Dr. Sneha Kulkarni", "Dentist", "Mumbai", "Smiles Dental Care & Implant Centre", "4.9", "+91 98200 12345"),
                createDoctor("Dr. Aditya Deshmukh", "Orthodontist (Dentist)", "Pune", "Deccan Dental Speciality Clinic", "4.8", "+91 98220 23456"),
                createDoctor("Dr. Rahul Patil", "Dentist", "Nagpur", "Orange City Dental Clinic", "4.7", "+91 98230 34567"),
                createDoctor("Dr. Rashmi Joshi", "Pediatric Dentist", "Thane", "Kids & Adult Dental Studio", "4.9", "+91 98201 45678"),
                createDoctor("Dr. Sameer Shinde", "Endodontist (Dentist)", "Nashik", "Nashik Crown & Dental Hospital", "4.8", "+91 98221 56789"),
                createDoctor("Dr. Priya Wagh", "Dentist", "Chhatrapati Sambhaji Nagar", "Marathwada Dental Care", "4.7", "+91 98231 67890"),
                createDoctor("Dr. Nilesh Gaikwad", "Dentist", "Solapur", "Solapur Multi-Speciality Dental Clinic", "4.8", "+91 98222 78901"),
                createDoctor("Dr. Varun Bhosale", "Oral & Maxillofacial Surgeon (Dentist)", "Kolhapur", "Mahalaxmi Dental Hospital", "4.9", "+91 98232 89012"),
                createDoctor("Dr. Tanvi Sawant", "Dentist", "Amravati", "Vidarbha Dental Clinic", "4.7", "+91 98223 90123"),
                createDoctor("Dr. Mahesh Jadhav", "Dentist", "Akola", "Akola Dental Centre", "4.8", "+91 98233 01234"),
                createDoctor("Dr. Anaya Kadam", "Dentist", "Latur", "Latur City Dental Care", "4.7", "+91 98224 12345"),
                createDoctor("Dr. Nitin Chaudhari", "Dentist", "Dhule", "Dhule Dental Hospital", "4.8", "+91 98234 23456"),
                createDoctor("Dr. Archana More", "Dentist", "Ahmednagar", "Ahmednagar Smile Care", "4.7", "+91 98225 34567"),
                createDoctor("Dr. Swapnil Pawar", "Dentist", "Jalgaon", "Khandesh Dental Hospital", "4.8", "+91 98235 45678"),
                createDoctor("Dr. Neeta Sanghavi", "Dentist", "Sangli", "Sangli Dental Care Clinic", "4.7", "+91 98226 56789"),
                createDoctor("Dr. Manoj Kothari", "Dentist", "Nanded", "Nanded Super Speciality Dental Clinic", "4.8", "+91 98236 67890"),
                createDoctor("Dr. Shilpa Thorat", "Dentist", "Satara", "Satara Crown Dental Clinic", "4.7", "+91 98227 78901"),
                createDoctor("Dr. Chetan Mahajan", "Dentist", "Ratnagiri", "Konkan Coast Dental Care", "4.8", "+91 98237 89012"),
                createDoctor("Dr. Vandana Rathi", "Dentist", "Chandrapur", "Chandrapur Dental Care", "4.7", "+91 98228 90123"),
                createDoctor("Dr. Kiran Deshpande", "Dentist", "Delhi", "Clove Dental Care", "4.9", "+91 98100 11223"),
                createDoctor("Dr. Swati Raman", "Dentist", "Bangalore", "Apollo White Dental Clinic", "4.9", "+91 98450 22334"),
                createDoctor("Dr. Rohit Reddy", "Dentist", "Hyderabad", "Sabka Dentist & Maxillofacial Centre", "4.8", "+91 98490 33445"),
                createDoctor("Dr. Vivek Sharma", "Dentist", "Ahmedabad", "Gujarat Dental Hospital", "4.8", "+91 98250 44556"),
                createDoctor("Dr. Gayatri Sen", "Dentist", "Kolkata", "Calcutta Dental Speciality Hospital", "4.8", "+91 98300 55667"),
                createDoctor("Dr. Karthik Sundaram", "Dentist", "Chennai", "Chennai Smile Centre", "4.9", "+91 98400 66778"),

                // --- MAHARASHTRA & METRO CITY SPECIALISTS ---
                createDoctor("Dr. Anjali Mehta", "General Physician", "Mumbai", "Lilavati Hospital", "4.8", "+91 98765 43210"),
                createDoctor("Dr. Rohan Kulkarni", "Cardiologist", "Mumbai", "Kokilaben Dhirubhai Ambani Hospital", "4.9", "+91 98765 11223"),
                createDoctor("Dr. Sara Iyer", "Dermatologist", "Mumbai", "Apollo Clinic, Bandra", "4.7", "+91 98765 99887"),
                createDoctor("Dr. Sunita Deshmukh", "Gynecologist", "Pune", "Sahyadri Super Speciality Hospital", "4.7", "+91 98220 54321"),
                createDoctor("Dr. Alok Joshi", "General Physician", "Pune", "Ruby Hall Clinic", "4.7", "+91 98230 11224"),
                createDoctor("Dr. Kedar Kulkarni", "Cardiologist", "Pune", "Deenanath Mangeshkar Hospital", "4.9", "+91 98225 33446"),
                createDoctor("Dr. Prashant Muley", "Neurologist", "Nagpur", "Wockhardt Super Speciality Hospital", "4.8", "+91 98230 99887"),
                createDoctor("Dr. Smita Patil", "Gynecologist", "Thane", "Jupiter Hospital", "4.7", "+91 98209 99001"),
                createDoctor("Dr. Suhas Kakde", "General Physician", "Nashik", "Wockhardt Hospital, Nashik", "4.8", "+91 98221 11223"),
                createDoctor("Dr. Abhay Chhabra", "Cardiologist", "Chhatrapati Sambhaji Nagar", "MGM Medical College & Hospital", "4.8", "+91 98231 22334"),
                createDoctor("Dr. Deepak Zadbuke", "Orthopedic Surgeon", "Solapur", "Ashwini Sahakari Rughnalaya", "4.7", "+91 98222 33445"),
                createDoctor("Dr. Ravindra Patil", "Cardiologist", "Kolhapur", "Apple Saraswati Multispeciality Hospital", "4.8", "+91 98232 44556"),
                createDoctor("Dr. Sanjay Rathi", "Pediatrician", "Amravati", "Rathi Children Hospital", "4.7", "+91 98223 55667"),
                createDoctor("Dr. Harish Agrawal", "General Physician", "Akola", "Icon Hospital", "4.8", "+91 98233 66778"),
                createDoctor("Dr. Sachin Deshmukh", "Neurologist", "Latur", "Vivekanand Hospital", "4.7", "+91 98224 77889"),
                createDoctor("Dr. Nilesh Jain", "General Physician", "Dhule", "Jain Multispeciality Hospital", "4.8", "+91 98234 88990"),
                createDoctor("Dr. Bharat Shinde", "Orthopedic Surgeon", "Ahmednagar", "Noble Hospital", "4.7", "+91 98225 99001"),
                createDoctor("Dr. Tushar Chaudhari", "Pediatrician", "Jalgaon", "Chaudhari Children Hospital", "4.8", "+91 98235 11223"),
                createDoctor("Dr. Satish Kulkarni", "Cardiologist", "Sangli", "Wanless Hospital", "4.8", "+91 98226 22334"),
                createDoctor("Dr. Vinod Nandedkar", "General Physician", "Nanded", "Global Super Speciality Hospital", "4.7", "+91 98236 33445"),
                createDoctor("Dr. Uday Patil", "Pediatrician", "Satara", "Cooperative Hospital", "4.7", "+91 98227 44556"),
                createDoctor("Dr. Shailesh Salvi", "Pulmonologist", "Ratnagiri", "Konkan Specialty Hospital", "4.8", "+91 98237 55667"),
                createDoctor("Dr. Atul Shah", "General Physician", "Chandrapur", "Christ Hospital", "4.7", "+91 98228 66778"),
                createDoctor("Dr. Rajesh Sharma", "Neurologist", "Delhi", "Max Super Speciality Hospital", "4.9", "+91 98111 22334"),
                createDoctor("Dr. Arisudan Singh", "Ophthalmologist", "Delhi", "Shroff Eye Centre", "4.9", "+91 98180 55667"),
                createDoctor("Dr. Pooja Gupta", "Rheumatologist", "Delhi", "AIIMS Hospital", "4.9", "+91 98112 66778"),
                createDoctor("Dr. Tarun Chawla", "General Physician", "Delhi", "Sir Ganga Ram Hospital", "4.8", "+91 98115 88990"),
                createDoctor("Dr. Priya Nair", "Pediatrician", "Bangalore", "Fortis Hospital, Bannerghatta", "4.8", "+91 98450 12345"),
                createDoctor("Dr. Vikramaditya Rao", "Orthopedic Surgeon", "Bangalore", "Manipal Hospital, HAL Road", "4.9", "+91 98451 67890"),
                createDoctor("Dr. Kavita Reddy", "Endocrinologist", "Hyderabad", "Apollo Hospitals, Jubilee Hills", "4.9", "+91 98490 87654"),
                createDoctor("Dr. Shalini Prasad", "Pediatrician", "Hyderabad", "Rainbow Children's Hospital", "4.8", "+91 98491 66778"),
                createDoctor("Dr. Deepa Venkat", "Neurologist", "Chennai", "MIOT International", "4.8", "+91 98400 44556"),
                createDoctor("Dr. Arvind Swaminathan", "Urologist", "Chennai", "Apollo Hospitals, Greams Road", "4.9", "+91 98401 55667"),
                createDoctor("Dr. Amitav Banerjee", "Gastroenterologist", "Kolkata", "AMRI Hospitals, Salt Lake", "4.8", "+91 98300 98765"),
                createDoctor("Dr. Jitesh Patel", "Cardiologist", "Ahmedabad", "Zydus Hospital", "4.9", "+91 98250 11223"),
                createDoctor("Dr. Hitesh Shah", "Orthopedic Surgeon", "Surat", "Kiran Multi Super Speciality Hospital", "4.8", "+91 98251 22334"),
                createDoctor("Dr. Sanjay Agarwal", "Orthopedic Surgeon", "Jaipur", "Fortis Escorts Hospital", "4.7", "+91 98290 77889"),
                createDoctor("Dr. Alok Srivastava", "General Physician", "Lucknow", "Sanjay Gandhi Post Graduate Institute", "4.9", "+91 98390 11223"),
                createDoctor("Dr. Neha Malhotra", "Psychiatrist", "Gurgaon", "Medanta - The Medicity", "4.8", "+91 98100 33445"),
                createDoctor("Dr. Ritu Saxena", "Dermatologist", "Gurgaon", "Fortis Memorial Research Institute", "4.8", "+91 98104 22335"),
                createDoctor("Dr. Vivek Saxena", "Cardiologist", "Indore", "CHL Hospitals", "4.8", "+91 98260 11223"),
                createDoctor("Dr. Mohan Sharma", "Neurologist", "Bhopal", "Bansal Hospital", "4.7", "+91 98261 22334"),
                createDoctor("Dr. Suresh Menon", "Pulmonologist", "Kochi", "Aster Medcity", "4.7", "+91 98950 11223"),
                createDoctor("Dr. Sanjeev Roy", "General Physician", "Patna", "Paras HMRI Hospital", "4.8", "+91 98350 11223"),
                createDoctor("Dr. Devendra Verma", "Cardiologist", "Kanpur", "Regency Hospital", "4.8", "+91 98391 22334")
            );
            doctorRepository.saveAll(dataset);
            System.out.println("✅ Comprehensive Doctors dataset successfully loaded: " + dataset.size() + " doctors inserted.");
        }
    }

    private Doctor createDoctor(String name, String specialty, String city, String hospital, String rating, String contact) {
        Doctor doc = new Doctor();
        doc.setName(name);
        doc.setSpecialty(specialty);
        doc.setCity(city);
        doc.setHospital(hospital);
        doc.setRating(new BigDecimal(rating));
        doc.setContact(contact);
        return doc;
    }
}
