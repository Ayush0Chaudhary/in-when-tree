package com.btp.inwhentrie.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.btp.inwhentrie.entity.Part;
import com.btp.inwhentrie.repository.PartRepository;

@Service
public class PartService {
    @Autowired
    private PartRepository partRepository;

    public List<Part> getAllParts() {
        return partRepository.findAll();
    }

    public Part getPartById(Long id) {
        return partRepository.findById(id).orElse(null);
    }

    public Part addPart(Part part) {
        return partRepository.save(part);
    }

    public List<Part> addParts(List<Part> parts) {
        return partRepository.saveAll(parts);
    }

    public Part updatePart(Part part) {
        final Part existingPart = partRepository.findById(part.getId()).orElse(null);
        existingPart.setName(part.getName());
        existingPart.setDescription(part.getDescription());
        existingPart.setQuantity(part.getQuantity());
        return existingPart;
    }

    public void deletePartById(Long id) {
        partRepository.deleteById(id);
    }

    public void deleteAllParts() {
        partRepository.deleteAll();
    }
}