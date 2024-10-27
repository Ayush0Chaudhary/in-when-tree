package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.Part;
import com.example.backend.repo.PartRepo;

@RestController
@RequestMapping("/part")
public class PartController {

    @Autowired
    PartRepo partRepo;

    @PostMapping()
    public void addPart(@RequestBody Part part) {
        partRepo.save(part);
    }

    @DeleteMapping("/{id}")
    public void deletePart(@PathVariable Long id) {
        partRepo.deleteById(id);
    }

    @PatchMapping("/{id}")
    public void updatePart(@PathVariable Long id, @RequestBody Part part) {
        partRepo.save(part);
    }

    @GetMapping()
    public Iterable<Part> getParts() {
        return partRepo.findAll();
    }
}
