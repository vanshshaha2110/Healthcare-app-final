package com.healthbot.repository;

import com.healthbot.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialtyContainingIgnoreCaseAndCityContainingIgnoreCase(String specialty, String city);
    List<Doctor> findBySpecialtyContainingIgnoreCase(String specialty);
    List<Doctor> findByCityContainingIgnoreCase(String city);
    Optional<Doctor> findFirstByNameContainingIgnoreCase(String name);

    @Query("SELECT d FROM Doctor d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.specialty) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.hospital) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Doctor> searchDoctors(@Param("query") String query);

    @Query("SELECT DISTINCT d.specialty FROM Doctor d ORDER BY d.specialty ASC")
    List<String> findDistinctSpecialties();

    @Query("SELECT DISTINCT d.city FROM Doctor d ORDER BY d.city ASC")
    List<String> findDistinctCities();
}
