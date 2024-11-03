package com.btp.inwhentrie.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.btp.inwhentrie.entity.Component;
import com.btp.inwhentrie.service.ComponentService;

@RestController
public class ComponentController {
    @Autowired
    private ComponentService componentService;

    @GetMapping("/components")
    public List<Component> getComponents() {
        return componentService.getAllComponents();
    }

    @PostMapping("/components")
    public Component addComponent(@RequestBody Component component) {
        // System.out.println("COMPONENT -> " + componentPart);
        System.out.println("COMPONENT -> " + component);

        // Component component = componentPart.getComponent();

        return componentService.addComponent(component);
    }

    @PutMapping("/update-component")
    public Component updateComponent(@RequestBody Component component) {
        System.out.println("COMPONENT -> " + component);
        return componentService.updateComponent(component);
    }

    @DeleteMapping("/delete-component")
    public void deleteComponet(@RequestParam Long id) {
        componentService.deleteComponentById(id);
    }

}
