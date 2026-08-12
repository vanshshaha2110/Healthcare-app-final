package com.healthbot.controller;

import com.healthbot.entity.Doctor;
import com.healthbot.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/recommend")
    public List<Doctor> recommend(@RequestParam(name = "specialty", required = false) String specialty,
                                   @RequestParam(name = "city", required = false) String city,
                                   @RequestParam(name = "query", required = false) String query) {
        if (query != null && !query.isBlank()) {
            return doctorRepository.searchDoctors(query.trim());
        }
        boolean hasSpecialty = specialty != null && !specialty.isBlank();
        boolean hasCity = city != null && !city.isBlank();

        if (hasSpecialty && hasCity) {
            return doctorRepository.findBySpecialtyContainingIgnoreCaseAndCityContainingIgnoreCase(specialty.trim(), city.trim());
        } else if (hasSpecialty) {
            return doctorRepository.findBySpecialtyContainingIgnoreCase(specialty.trim());
        } else if (hasCity) {
            return doctorRepository.findByCityContainingIgnoreCase(city.trim());
        }
        return doctorRepository.findAll();
    }

    @GetMapping
    public List<Doctor> getAll() {
        return doctorRepository.findAll();
    }

    @GetMapping("/metadata")
    public Map<String, List<String>> getMetadata() {
        return Map.of(
            "specialties", doctorRepository.findDistinctSpecialties(),
            "cities", doctorRepository.findDistinctCities()
        );
    }
}
