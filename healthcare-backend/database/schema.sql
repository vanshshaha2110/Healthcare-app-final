-- ============================================
-- Healthcare Chatbot - Comprehensive Doctor Dataset & Schema
-- Includes Dentists, Maharashtra Cities & Major Indian Metros
-- ============================================

CREATE TABLE IF NOT EXISTS documents (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT DEFAULT 1,
    file_name       VARCHAR(255),
    document_type   VARCHAR(50),
    extracted_text  TEXT,
    ai_summary      TEXT,
    uploaded_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT DEFAULT 1,
    role        VARCHAR(20),
    message     TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminders (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT DEFAULT 1,
    medicine_name  VARCHAR(255),
    dosage         VARCHAR(100),
    frequency      VARCHAR(100),
    reminder_times VARCHAR(255),
    end_date       DATE,
    active         BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS doctors (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(255),
    specialty    VARCHAR(100),
    city         VARCHAR(100),
    hospital     VARCHAR(255),
    rating       DECIMAL(2,1),
    contact      VARCHAR(100)
);

-- Seed Comprehensive Doctors Dataset (Dentists + Maharashtra & Indian Metro Cities)
INSERT INTO doctors (name, specialty, city, hospital, rating, contact) VALUES
('Dr. Sneha Kulkarni', 'Dentist', 'Mumbai', 'Smiles Dental Care & Implant Centre', 4.9, '+91 98200 12345'),
('Dr. Aditya Deshmukh', 'Orthodontist (Dentist)', 'Pune', 'Deccan Dental Speciality Clinic', 4.8, '+91 98220 23456'),
('Dr. Rahul Patil', 'Dentist', 'Nagpur', 'Orange City Dental Clinic', 4.7, '+91 98230 34567'),
('Dr. Rashmi Joshi', 'Pediatric Dentist', 'Thane', 'Kids & Adult Dental Studio', 4.9, '+91 98201 45678'),
('Dr. Sameer Shinde', 'Endodontist (Dentist)', 'Nashik', 'Nashik Crown & Dental Hospital', 4.8, '+91 98221 56789'),
('Dr. Priya Wagh', 'Dentist', 'Chhatrapati Sambhaji Nagar', 'Marathwada Dental Care', 4.7, '+91 98231 67890'),
('Dr. Nilesh Gaikwad', 'Dentist', 'Solapur', 'Solapur Multi-Speciality Dental Clinic', 4.8, '+91 98222 78901'),
('Dr. Varun Bhosale', 'Oral & Maxillofacial Surgeon (Dentist)', 'Kolhapur', 'Mahalaxmi Dental Hospital', 4.9, '+91 98232 89012'),
('Dr. Tanvi Sawant', 'Dentist', 'Amravati', 'Vidarbha Dental Clinic', 4.7, '+91 98223 90123'),
('Dr. Mahesh Jadhav', 'Dentist', 'Akola', 'Akola Dental Centre', 4.8, '+91 98233 01234'),
('Dr. Anaya Kadam', 'Dentist', 'Latur', 'Latur City Dental Care', 4.7, '+91 98224 12345'),
('Dr. Nitin Chaudhari', 'Dentist', 'Dhule', 'Dhule Dental Hospital', 4.8, '+91 98234 23456'),
('Dr. Archana More', 'Dentist', 'Ahmednagar', 'Ahmednagar Smile Care', 4.7, '+91 98225 34567'),
('Dr. Swapnil Pawar', 'Dentist', 'Jalgaon', 'Khandesh Dental Hospital', 4.8, '+91 98235 45678'),
('Dr. Neeta Sanghavi', 'Dentist', 'Sangli', 'Sangli Dental Care Clinic', 4.7, '+91 98226 56789'),
('Dr. Manoj Kothari', 'Dentist', 'Nanded', 'Nanded Super Speciality Dental Clinic', 4.8, '+91 98236 67890'),
('Dr. Shilpa Thorat', 'Dentist', 'Satara', 'Satara Crown Dental Clinic', 4.7, '+91 98227 78901'),
('Dr. Chetan Mahajan', 'Dentist', 'Ratnagiri', 'Konkan Coast Dental Care', 4.8, '+91 98237 89012'),
('Dr. Vandana Rathi', 'Dentist', 'Chandrapur', 'Chandrapur Dental Care', 4.7, '+91 98228 90123'),
('Dr. Kiran Deshpande', 'Dentist', 'Delhi', 'Clove Dental Care', 4.9, '+91 98100 11223'),
('Dr. Swati Raman', 'Dentist', 'Bangalore', 'Apollo White Dental Clinic', 4.9, '+91 98450 22334'),
('Dr. Rohit Reddy', 'Dentist', 'Hyderabad', 'Sabka Dentist & Maxillofacial Centre', 4.8, '+91 98490 33445'),
('Dr. Vivek Sharma', 'Dentist', 'Ahmedabad', 'Gujarat Dental Hospital', 4.8, '+91 98250 44556'),
('Dr. Gayatri Sen', 'Dentist', 'Kolkata', 'Calcutta Dental Speciality Hospital', 4.8, '+91 98300 55667'),
('Dr. Karthik Sundaram', 'Dentist', 'Chennai', 'Chennai Smile Centre', 4.9, '+91 98400 66778'),
('Dr. Anjali Mehta', 'General Physician', 'Mumbai', 'Lilavati Hospital', 4.8, '+91 98765 43210'),
('Dr. Rohan Kulkarni', 'Cardiologist', 'Mumbai', 'Kokilaben Dhirubhai Ambani Hospital', 4.9, '+91 98765 11223'),
('Dr. Sara Iyer', 'Dermatologist', 'Mumbai', 'Apollo Clinic, Bandra', 4.7, '+91 98765 99887'),
('Dr. Sunita Deshmukh', 'Gynecologist', 'Pune', 'Sahyadri Super Speciality Hospital', 4.7, '+91 98220 54321'),
('Dr. Alok Joshi', 'General Physician', 'Pune', 'Ruby Hall Clinic', 4.7, '+91 98230 11224'),
('Dr. Kedar Kulkarni', 'Cardiologist', 'Pune', 'Deenanath Mangeshkar Hospital', 4.9, '+91 98225 33446'),
('Dr. Prashant Muley', 'Neurologist', 'Nagpur', 'Wockhardt Super Speciality Hospital', 4.8, '+91 98230 99887'),
('Dr. Smita Patil', 'Gynecologist', 'Thane', 'Jupiter Hospital', 4.7, '+91 98209 99001'),
('Dr. Suhas Kakde', 'General Physician', 'Nashik', 'Wockhardt Hospital, Nashik', 4.8, '+91 98221 11223'),
('Dr. Abhay Chhabra', 'Cardiologist', 'Chhatrapati Sambhaji Nagar', 'MGM Medical College & Hospital', 4.8, '+91 98231 22334'),
('Dr. Deepak Zadbuke', 'Orthopedic Surgeon', 'Solapur', 'Ashwini Sahakari Rughnalaya', 4.7, '+91 98222 33445'),
('Dr. Ravindra Patil', 'Cardiologist', 'Kolhapur', 'Apple Saraswati Multispeciality Hospital', 4.8, '+91 98232 44556'),
('Dr. Sanjay Rathi', 'Pediatrician', 'Amravati', 'Rathi Children Hospital', 4.7, '+91 98223 55667'),
('Dr. Harish Agrawal', 'General Physician', 'Akola', 'Icon Hospital', 4.8, '+91 98233 66778'),
('Dr. Sachin Deshmukh', 'Neurologist', 'Latur', 'Vivekanand Hospital', 4.7, '+91 98224 77889'),
('Dr. Nilesh Jain', 'General Physician', 'Dhule', 'Jain Multispeciality Hospital', 4.8, '+91 98234 88990'),
('Dr. Bharat Shinde', 'Orthopedic Surgeon', 'Ahmednagar', 'Noble Hospital', 4.7, '+91 98225 99001'),
('Dr. Tushar Chaudhari', 'Pediatrician', 'Jalgaon', 'Chaudhari Children Hospital', 4.8, '+91 98235 11223'),
('Dr. Satish Kulkarni', 'Cardiologist', 'Sangli', 'Wanless Hospital', 4.8, '+91 98226 22334'),
('Dr. Vinod Nandedkar', 'General Physician', 'Nanded', 'Global Super Speciality Hospital', 4.7, '+91 98236 33445'),
('Dr. Uday Patil', 'Pediatrician', 'Satara', 'Cooperative Hospital', 4.7, '+91 98227 44556'),
('Dr. Shailesh Salvi', 'Pulmonologist', 'Ratnagiri', 'Konkan Specialty Hospital', 4.8, '+91 98237 55667'),
('Dr. Atul Shah', 'General Physician', 'Chandrapur', 'Christ Hospital', 4.7, '+91 98228 66778'),
('Dr. Rajesh Sharma', 'Neurologist', 'Delhi', 'Max Super Speciality Hospital', 4.9, '+91 98111 22334'),
('Dr. Arisudan Singh', 'Ophthalmologist', 'Delhi', 'Shroff Eye Centre', 4.9, '+91 98180 55667'),
('Dr. Pooja Gupta', 'Rheumatologist', 'Delhi', 'AIIMS Hospital', 4.9, '+91 98112 66778'),
('Dr. Tarun Chawla', 'General Physician', 'Delhi', 'Sir Ganga Ram Hospital', 4.8, '+91 98115 88990'),
('Dr. Priya Nair', 'Pediatrician', 'Bangalore', 'Fortis Hospital, Bannerghatta', 4.8, '+91 98450 12345'),
('Dr. Vikramaditya Rao', 'Orthopedic Surgeon', 'Bangalore', 'Manipal Hospital, HAL Road', 4.9, '+91 98451 67890'),
('Dr. Kavita Reddy', 'Endocrinologist', 'Hyderabad', 'Apollo Hospitals, Jubilee Hills', 4.9, '+91 98490 87654'),
('Dr. Shalini Prasad', 'Pediatrician', 'Hyderabad', 'Rainbow Children''s Hospital', 4.8, '+91 98491 66778'),
('Dr. Deepa Venkat', 'Neurologist', 'Chennai', 'MIOT International', 4.8, '+91 98400 44556'),
('Dr. Arvind Swaminathan', 'Urologist', 'Chennai', 'Apollo Hospitals, Greams Road', 4.9, '+91 98401 55667'),
('Dr. Amitav Banerjee', 'Gastroenterologist', 'Kolkata', 'AMRI Hospitals, Salt Lake', 4.8, '+91 98300 98765'),
('Dr. Jitesh Patel', 'Cardiologist', 'Ahmedabad', 'Zydus Hospital', 4.9, '+91 98250 11223'),
('Dr. Hitesh Shah', 'Orthopedic Surgeon', 'Surat', 'Kiran Multi Super Speciality Hospital', 4.8, '+91 98251 22334'),
('Dr. Sanjay Agarwal', 'Orthopedic Surgeon', 'Jaipur', 'Fortis Escorts Hospital', 4.7, '+91 98290 77889'),
('Dr. Alok Srivastava', 'General Physician', 'Lucknow', 'Sanjay Gandhi Post Graduate Institute', 4.9, '+91 98390 11223'),
('Dr. Neha Malhotra', 'Psychiatrist', 'Gurgaon', 'Medanta - The Medicity', 4.8, '+91 98100 33445'),
('Dr. Ritu Saxena', 'Dermatologist', 'Gurgaon', 'Fortis Memorial Research Institute', 4.8, '+91 98104 22335'),
('Dr. Vivek Saxena', 'Cardiologist', 'Indore', 'CHL Hospitals', 4.8, '+91 98260 11223'),
('Dr. Mohan Sharma', 'Neurologist', 'Bhopal', 'Bansal Hospital', 4.7, '+91 98261 22334'),
('Dr. Suresh Menon', 'Pulmonologist', 'Kochi', 'Aster Medcity', 4.7, '+91 98950 11223'),
('Dr. Sanjeev Roy', 'General Physician', 'Patna', 'Paras HMRI Hospital', 4.8, '+91 98350 11223'),
('Dr. Devendra Verma', 'Cardiologist', 'Kanpur', 'Regency Hospital', 4.8, '+91 98391 22334')
ON CONFLICT DO NOTHING;
