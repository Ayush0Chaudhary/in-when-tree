package com.btp.inwhentrie.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.btp.inwhentrie.entity.Part;
import com.btp.inwhentrie.service.PartService;

@RestController
public class PartController {
    @Autowired
    private PartService partService;

    @GetMapping("/parts")
    public List<Part> getPart() {
        return partService.getAllParts();
    }

    @PostMapping("/parts")
    public Part addPart(@RequestBody Part part) {
        return partService.addPart(part);
    }

    @PutMapping("/update-part")
    public Part updatePart(@RequestBody Part part) {
        return partService.updatePart(part);
    }

    @DeleteMapping("/delete-part")
    public void deletePart(@RequestParam Long id) {
        partService.deletePartById(id);
    }

}
