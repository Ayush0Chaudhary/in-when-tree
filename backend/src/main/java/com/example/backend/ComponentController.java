package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.repo.ComponentRepo;

@RestController
@RequestMapping("/component")
public class ComponentController {

    @Autowired
    ComponentRepo componentRepo;


}
